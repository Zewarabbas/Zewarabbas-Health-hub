export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  featured?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
}
