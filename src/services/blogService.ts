import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const COLLECTION_NAME = 'posts';

export const blogService = {
  // Get all posts
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as BlogPost;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${slug}`);
      return null;
    }
  },

  // Create new post
  async createPost(post: Omit<BlogPost, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...post,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return '';
    }
  },

  // Update post
  async updatePost(id: string, post: Partial<BlogPost>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...post,
        updatedAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    }
  },

  // Delete post
  async deletePost(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  },

  // Subscribe to posts (Real-time)
  subscribeToPosts(callback: (posts: BlogPost[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      callback(posts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  // Search posts
  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPosts();
      const term = searchTerm.toLowerCase();
      return posts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.excerpt.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  // Get paginated posts
  async getPaginatedPosts(page: number, pageSize: number): Promise<{ posts: BlogPost[], total: number }> {
    try {
      const allPosts = await this.getAllPosts();
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        posts: allPosts.slice(start, end),
        total: allPosts.length
      };
    } catch (error) {
      console.error('Pagination error:', error);
      return { posts: [], total: 0 };
    }
  },

  // Migration: Seed initial data if collection is empty
  async seedInitialData() {
    // Only attempt seeding if we are the admin
    if (auth.currentUser?.email !== 'fast8585100@gmail.com') {
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      if (snapshot.empty) {
        console.log('Seeding initial blog posts...');
        for (const post of BLOG_POSTS) {
          const { id, ...postData } = post;
          await addDoc(collection(db, COLLECTION_NAME), {
            ...postData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        }
        console.log('Seeding complete.');
      }
    } catch (error) {
      console.warn('Seeding failed:', error);
    }
  }
};
