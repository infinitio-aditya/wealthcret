export interface UserDocument {
    id: number;
    user: number;
    document_type: string;
    file_name: string;
    is_enabled: boolean;
    is_uploaded: boolean;
    created_at: string;
    updated_at: string;
    document_class: number;
}

export interface UserDocumentResponse {
    success: boolean;
    message: string;
}
