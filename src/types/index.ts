export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Equipment {
    id: string; // Document ID do Firestore
    category_id: string; // Referência à Categoria
    name: string;
    description: string;
    price_per_day: number;
    image_urls: string[];
    is_active: boolean;
    created_at: string;
}

export interface SiteSettings {
    whatsapp_number: string;
    instagram_url: string;
}
