export const hashTableImplementations = {
  c: `
#define TABLE_SIZE 10

struct Node {
    int key;
    int value;
    struct Node* next;
};

struct HashTable {
    struct Node* table[TABLE_SIZE];
};

int hash(int key) {
    return key % TABLE_SIZE;
}

void insert(struct HashTable* ht, int key, int value) {
    int index = hash(key);
    
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->key = key;
    newNode->value = value;
    newNode->next = NULL;
    
    if (ht->table[index] == NULL) {
        ht->table[index] = newNode;
    } else {
        newNode->next = ht->table[index];
        ht->table[index] = newNode;
    }
}

int search(struct HashTable* ht, int key) {
    int index = hash(key);
    struct Node* current = ht->table[index];
    
    while (current != NULL) {
        if (current->key == key) {
            return current->value;
        }
        current = current->next;
    }
    
    return -1; // Not found
}`,

  cpp: `
template <typename K, typename V>
class HashTable {
private:
    static const int TABLE_SIZE = 10;
    
    struct Node {
        K key;
        V value;
        Node* next;
        Node(K k, V v) : key(k), value(v), next(nullptr) {}
    };
    
    Node* table[TABLE_SIZE];
    
    int hash(K key) {
        return std::hash<K>{}(key) % TABLE_SIZE;
    }
    
public:
    HashTable() {
        for (int i = 0; i < TABLE_SIZE; i++) {
            table[i] = nullptr;
        }
    }
    
    void insert(K key, V value) {
        int index = hash(key);
        Node* newNode = new Node(key, value);
        
        if (table[index] == nullptr) {
            table[index] = newNode;
        } else {
            newNode->next = table[index];
            table[index] = newNode;
        }
    }
    
    bool get(K key, V& value) {
        int index = hash(key);
        Node* current = table[index];
        
        while (current != nullptr) {
            if (current->key == key) {
                value = current->value;
                return true;
            }
            current = current->next;
        }
        
        return false;
    }
    
    bool remove(K key) {
        int index = hash(key);
        Node* current = table[index];
        Node* prev = nullptr;
        
        while (current != nullptr) {
            if (current->key == key) {
                if (prev == nullptr) {
                    table[index] = current->next;
                } else {
                    prev->next = current->next;
                }
                delete current;
                return true;
            }
            prev = current;
            current = current->next;
        }
        
        return false;
    }
};`,

  python: `
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(self.size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def insert(self, key, value):
        index = self._hash(key)
        
        # Check if key exists and update
        for item in self.table[index]:
            if item[0] == key:
                item[1] = value
                return
        
        # If key doesn't exist, append new key-value pair
        self.table[index].append([key, value])
    
    def get(self, key):
        index = self._hash(key)
        
        for item in self.table[index]:
            if item[0] == key:
                return item[1]
        
        raise KeyError(f"Key '{key}' not found")
    
    def remove(self, key):
        index = self._hash(key)
        
        for i, item in enumerate(self.table[index]):
            if item[0] == key:
                self.table[index].pop(i)
                return
        
        raise KeyError(f"Key '{key}' not found")`,

  java: `
class HashTable<K, V> {
    private static final int TABLE_SIZE = 10;
    private Node<K, V>[] table;
    
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> next;
        
        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
    
    @SuppressWarnings("unchecked")
    public HashTable() {
        table = new Node[TABLE_SIZE];
    }
    
    private int hash(K key) {
        return Math.abs(key.hashCode() % TABLE_SIZE);
    }
    
    public void put(K key, V value) {
        int index = hash(key);
        Node<K, V> newNode = new Node<>(key, value);
        
        if (table[index] == null) {
            table[index] = newNode;
        } else {
            Node<K, V> current = table[index];
            
            // Update value if key exists
            while (current != null) {
                if (current.key.equals(key)) {
                    current.value = value;
                    return;
                }
                if (current.next == null) break;
                current = current.next;
            }
            
            // Add new node at the end of chain
            current.next = newNode;
        }
    }
    
    public V get(K key) {
        int index = hash(key);
        Node<K, V> current = table[index];
        
        while (current != null) {
            if (current.key.equals(key)) {
                return current.value;
            }
            current = current.next;
        }
        
        return null;
    }
}`
};

export const hashTableUseCases = [
  {
    title: "Symbol Tables and Caching",
    description: "Hash tables are used in compiler implementations to store variables, functions, and their attributes. They also serve as a foundation for caching systems to store frequently accessed data."
  },
  {
    title: "Database Indexing",
    description: "Hash-based indices in databases allow for O(1) lookup times for exact-match queries on indexed columns."
  },
  {
    title: "De-duplication",
    description: "Hash tables efficiently track unique elements in a dataset, commonly used in removing duplicates from arrays or streams of data."
  },
  {
    title: "Frequency Counting",
    description: "Count occurrences of elements in an array or stream, useful for analytics and data processing tasks."
  }
];

export const hashTableRelatedProblems = [
  {
    id: "lc-1",
    title: "Two Sum",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: "lc-217",
    title: "Contains Duplicate",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/contains-duplicate/"
  },
  {
    id: "lc-1512",
    title: "Number of Good Pairs",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/number-of-good-pairs/"
  },
  {
    id: "cf-4A",
    title: "Watermelon",
    platform: "codeforces",
    difficulty: "Easy",
    url: "https://codeforces.com/problemset/problem/4/A"
  },
  {
    id: "lc-49",
    title: "Group Anagrams",
    platform: "leetcode",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/group-anagrams/"
  }
];
