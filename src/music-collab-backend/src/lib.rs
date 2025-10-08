// (But for Rust, use: DKeeper-App-Blockchain/src/dkeeper_backend/lib.rs)

use candid::{CandidType, Deserialize};
use std::collections::HashMap;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
};

#[derive(CandidType, Deserialize, Clone)]
pub struct MusicProject {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub owner: String,
    pub contributors: Vec<String>,
    pub tracks: Vec<Track>,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct Track {
    pub id: u64,
    pub name: String,
    pub ipfs_hash: String,
    pub uploaded_by: String,
    pub timestamp: u64,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct NFTMetadata {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub image_url: String,
    pub creator: String,
    pub project_id: u64,
    pub price: u64,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct PinataUploadRequest {
    pub file_data: Vec<u8>,
    pub file_name: String,
    pub content_type: String,
    pub api_key: String,
    pub secret_key: String,
}

#[derive(CandidType, Deserialize, Clone)]
pub struct PinataUploadResponse {
    pub success: bool,
    pub ipfs_hash: String,
    pub pin_size: u64,
    pub error: Option<String>,
}

thread_local! {
    static PROJECTS: std::cell::RefCell<HashMap<u64, MusicProject>> = std::cell::RefCell::new(HashMap::new());
    static NFTS: std::cell::RefCell<HashMap<u64, NFTMetadata>> = std::cell::RefCell::new(HashMap::new());
    static NEXT_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
    static NEXT_NFT_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
}

#[ic_cdk::update]
fn create_project(title: String, description: String, owner: String) -> u64 {
    let id = NEXT_ID.with(|id| {
        let mut id = id.borrow_mut();
        let current = *id;
        *id += 1;
        current
    });
    let project = MusicProject {
        id,
        title,
        description,
        owner,
        contributors: vec![],
        tracks: vec![],
    };
    PROJECTS.with(|projects| {
        projects.borrow_mut().insert(id, project);
    });
    id
}

#[ic_cdk::update]
fn add_track(
    project_id: u64, 
    name: String, 
    ipfs_hash: String, 
    uploaded_by: String, 
    timestamp: u64
) -> bool {
    PROJECTS.with(|projects| {
        let mut projects = projects.borrow_mut();
        if let Some(project) = projects.get_mut(&project_id) {
            // Generate unique track ID using timestamp and random component
            let track_id = timestamp;
            
            let track = Track {
                id: track_id,
                name,
                ipfs_hash,
                uploaded_by,
                timestamp,
            };
            project.tracks.push(track);
            true
        } else {
            false
        }
    })
}

#[ic_cdk::query]
fn get_project(project_id: u64) -> Option<MusicProject> {
    PROJECTS.with(|projects| projects.borrow().get(&project_id).cloned())
}

#[ic_cdk::query]
fn list_projects() -> Vec<MusicProject> {
    PROJECTS.with(|projects| {
        projects.borrow().values().cloned().collect()
    })
}

#[ic_cdk::update]
fn add_contributor(project_id: u64, contributor: String) -> bool {
    PROJECTS.with(|projects| {
        let mut projects = projects.borrow_mut();
        if let Some(project) = projects.get_mut(&project_id) {
            if !project.contributors.contains(&contributor) {
                project.contributors.push(contributor);
            }
            true
        } else {
            false
        }
    })
}

#[ic_cdk::update]
fn remove_track(project_id: u64, track_id: u64) -> bool {
    PROJECTS.with(|projects| {
        let mut projects = projects.borrow_mut();
        if let Some(project) = projects.get_mut(&project_id) {
            project.tracks.retain(|track| track.id != track_id);
            true
        } else {
            false
        }
    })
}

#[ic_cdk::query]
fn get_project_tracks(project_id: u64) -> Vec<Track> {
    PROJECTS.with(|projects| {
        projects.borrow()
            .get(&project_id)
            .map(|project| project.tracks.clone())
            .unwrap_or_default()
    })
}

#[ic_cdk::update]
fn mint_nft(name: String, description: String, image_url: String, creator: String, project_id: u64, price: u64) -> u64 {
    let id = NEXT_NFT_ID.with(|id| {
        let mut id = id.borrow_mut();
        let current = *id;
        *id += 1;
        current
    });
    
    let nft = NFTMetadata {
        id,
        name,
        description,
        image_url,
        creator,
        project_id,
        price,
    };
    
    NFTS.with(|nfts| {
        nfts.borrow_mut().insert(id, nft);
    });
    
    id
}

#[ic_cdk::query]
fn list_nfts() -> Vec<NFTMetadata> {
    NFTS.with(|nfts| {
        nfts.borrow().values().cloned().collect()
    })
}

#[ic_cdk::query]
fn get_nft(nft_id: u64) -> Option<NFTMetadata> {
    NFTS.with(|nfts| nfts.borrow().get(&nft_id).cloned())
}

#[ic_cdk::update]
async fn upload_to_pinata(request: PinataUploadRequest) -> PinataUploadResponse {
    // Create multipart/form-data body
    let boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    let mut body = Vec::new();
    
    // Add file field
    body.extend_from_slice(format!("--{}\r\n", boundary).as_bytes());
    body.extend_from_slice(b"Content-Disposition: form-data; name=\"file\"; filename=\"");
    body.extend_from_slice(request.file_name.as_bytes());
    body.extend_from_slice(b"\"\r\n");
    body.extend_from_slice(format!("Content-Type: {}\r\n\r\n", request.content_type).as_bytes());
    body.extend_from_slice(&request.file_data);
    body.extend_from_slice(b"\r\n");
    
    // Add metadata field
    let metadata = format!(
        r#"{{"name":"{}","keyvalues":{{"type":"audio","uploadedVia":"IC-Backend","timestamp":"{}"}}}}"#,
        request.file_name,
        ic_cdk::api::time()
    );
    body.extend_from_slice(format!("--{}\r\n", boundary).as_bytes());
    body.extend_from_slice(b"Content-Disposition: form-data; name=\"pinataMetadata\"\r\n\r\n");
    body.extend_from_slice(metadata.as_bytes());
    body.extend_from_slice(b"\r\n");
    
    // End boundary
    body.extend_from_slice(format!("--{}--\r\n", boundary).as_bytes());
    
    let headers = vec![
        HttpHeader {
            name: "Content-Type".to_string(),
            value: format!("multipart/form-data; boundary={}", boundary),
        },
        HttpHeader {
            name: "pinata_api_key".to_string(),
            value: request.api_key,
        },
        HttpHeader {
            name: "pinata_secret_api_key".to_string(),
            value: request.secret_key,
        },
    ];
    
    let request_args = CanisterHttpRequestArgument {
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS".to_string(),
        method: HttpMethod::POST,
        body: Some(body),
        max_response_bytes: Some(2048),
        transform: None,
        headers,
    };
    
    match http_request(request_args, 2_000_000_000).await {
        Ok((response,)) => {
            if response.status == candid::Nat::from(200u8) {
                // Parse JSON response
                if let Ok(response_text) = String::from_utf8(response.body) {
                    // Simple JSON parsing for IPFS hash
                    if let Some(start) = response_text.find("\"IpfsHash\":\"") {
                        let start = start + 12; // Length of "\"IpfsHash\":\""
                        if let Some(end) = response_text[start..].find("\"") {
                            let ipfs_hash = response_text[start..start + end].to_string();
                            
                            // Extract pin size if available
                            let pin_size = if let Some(size_start) = response_text.find("\"PinSize\":") {
                                let size_start = size_start + 10;
                                if let Some(size_end) = response_text[size_start..].find(",") {
                                    response_text[size_start..size_start + size_end]
                                        .parse::<u64>()
                                        .unwrap_or(0)
                                } else {
                                    0
                                }
                            } else {
                                0
                            };
                            
                            return PinataUploadResponse {
                                success: true,
                                ipfs_hash,
                                pin_size,
                                error: None,
                            };
                        }
                    }
                }
                
                PinataUploadResponse {
                    success: false,
                    ipfs_hash: String::new(),
                    pin_size: 0,
                    error: Some("Failed to parse Pinata response".to_string()),
                }
            } else {
                PinataUploadResponse {
                    success: false,
                    ipfs_hash: String::new(),
                    pin_size: 0,
                    error: Some(format!("Pinata API error: {}", response.status)),
                }
            }
        }
        Err(e) => PinataUploadResponse {
            success: false,
            ipfs_hash: String::new(),
            pin_size: 0,
            error: Some(format!("HTTP request failed: {:?}", e)),
        },
    }
}

// Transform function for HTTP outcalls (required by IC)
#[ic_cdk::query]
fn transform_response(args: TransformArgs) -> HttpResponse {
    args.response
}