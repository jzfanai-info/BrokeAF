import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  deleteDoc, 
  doc,
  updateDoc,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import { Transaction, FinancialPlan, Category, TransactionType } from "../types";
import { DEFAULT_CATEGORIES } from "../constants";

// Helper to handle Firestore Errors
const handleFirestoreError = (error: any, action: string) => {
  console.error(`Error ${action}:`, error);
  if (error.code === 'permission-denied') {
    alert("Database Permission Denied. \nPlease check your Firestore Security Rules in the Firebase Console.\nEnsure you allow read/write: if request.auth.uid == userId;");
  }
  throw error;
};

// --- Service Functions ---

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, "users", userId, "transactions"), {
      ...transaction,
      createdAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, "adding transaction");
  }
};

export const updateTransaction = async (userId: string, transactionId: string, updates: Partial<Transaction>) => {
  try {
    const docRef = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, "updating transaction");
  }
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  console.log(`Deleting transaction ${transactionId} for user ${userId}`);
  try {
    await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
  } catch (error) {
    handleFirestoreError(error, "deleting transaction");
  }
};

export const subscribeToTransactions = (userId: string, callback: (data: Transaction[]) => void) => {
  const q = query(
    collection(db, "users", userId, "transactions"),
    orderBy("date", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = [];
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });
    callback(transactions);
  }, (error) => {
    console.error("Snapshot error:", error);
    // Silent fail for snapshot to avoid spamming alerts, but log it
  });
};

// --- Financial Plan Management ---

export const addFinancialPlan = async (userId: string, plan: Omit<FinancialPlan, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, "users", userId, "financial_plans"), {
      ...plan,
      createdAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, "adding financial plan");
  }
};

export const updateFinancialPlan = async (userId: string, planId: string, updates: Partial<FinancialPlan>) => {
  try {
    await updateDoc(doc(db, "users", userId, "financial_plans", planId), updates);
  } catch (error) {
    handleFirestoreError(error, "updating financial plan");
  }
};

export const deleteFinancialPlan = async (userId: string, planId: string) => {
  console.log(`Deleting plan ${planId} for user ${userId}`);
  try {
    await deleteDoc(doc(db, "users", userId, "financial_plans", planId));
  } catch (error) {
    handleFirestoreError(error, "deleting financial plan");
  }
};

export const subscribeToPlans = (userId: string, callback: (data: FinancialPlan[]) => void) => {
  const q = query(
    collection(db, "users", userId, "financial_plans"), 
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const plans: FinancialPlan[] = [];
    snapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() } as FinancialPlan);
    });
    callback(plans);
  });
};

// --- Category Management ---

const seedDefaultCategories = async (userId: string) => {
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "users", userId, "categories");

    // Add NA category
    const naDoc = doc(colRef);
    batch.set(naDoc, { name: 'NA', type: 'expense', isSystem: true }); // Type doesn't matter much for NA, but required
    
    DEFAULT_CATEGORIES.income.forEach(name => {
      const ref = doc(colRef);
      batch.set(ref, { name, type: 'income', isSystem: false });
    });

    DEFAULT_CATEGORIES.expense.forEach(name => {
      const ref = doc(colRef);
      batch.set(ref, { name, type: 'expense', isSystem: false });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error seeding categories:", error);
    // Don't throw here, allowing app to partially function, but permissions likely the cause
  }
};

export const subscribeToCategories = (userId: string, callback: (data: Category[]) => void) => {
  const q = query(collection(db, "users", userId, "categories"), orderBy("name"));
  return onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) {
      // Auto-seed if empty
      await seedDefaultCategories(userId);
      return;
    }
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });
    callback(categories);
  });
};

export const addCategory = async (userId: string, category: Omit<Category, 'id'>) => {
  try {
    await addDoc(collection(db, "users", userId, "categories"), category);
  } catch (error) {
    handleFirestoreError(error, "adding category");
  }
};

export const deleteCategory = async (userId: string, categoryId: string, categoryName: string) => {
  if (categoryName === 'NA') return; // Should not happen, but safeguard

  try {
    // Firestore Atomic Batch
    const batch = writeBatch(db);

    // 1. Delete Category Doc
    const catRef = doc(db, "users", userId, "categories", categoryId);
    batch.delete(catRef);

    // 2. Find transactions with this category and update to NA
    const q = query(collection(db, "users", userId, "transactions"), where("category", "==", categoryName));
    const snapshot = await getDocs(q);
    
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { category: 'NA' });
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, "deleting category");
  }
};