export const linkedListImplementations = {
  c: `
struct Node {
    int data;
    struct Node* next;
};

// Function to create a new node
struct Node* createNode(int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

// Function to insert at beginning
struct Node* insertAtBeginning(struct Node* head, int data) {
    struct Node* newNode = createNode(data);
    newNode->next = head;
    return newNode;
}

// Function to print the linked list
void printList(struct Node* head) {
    struct Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}`,

  cpp: `
template <typename T>
class Node {
public:
    T data;
    Node* next;
    
    Node(T value) : data(value), next(nullptr) {}
};

template <typename T>
class LinkedList {
private:
    Node<T>* head;
    
public:
    LinkedList() : head(nullptr) {}
    
    // Insert at beginning
    void insertFront(T value) {
        Node<T>* newNode = new Node<T>(value);
        newNode->next = head;
        head = newNode;
    }
    
    // Print the list
    void print() {
        Node<T>* current = head;
        while (current != nullptr) {
            cout << current->data << " -> ";
            current = current->next;
        }
        cout << "nullptr" << endl;
    }
    
    // Destructor to free memory
    ~LinkedList() {
        Node<T>* current = head;
        while (current != nullptr) {
            Node<T>* next = current->next;
            delete current;
            current = next;
        }
    }
};`,

  python: `
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def print_list(self):
        current = self.head
        while current:
            print(f"{current.data} -> ", end="")
            current = current.next
        print("None")
    
    def search(self, key):
        current = self.head
        while current:
            if current.data == key:
                return True
            current = current.next
        return False`,

  java: `
class Node<T> {
    T data;
    Node<T> next;
    
    Node(T data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList<T> {
    private Node<T> head;
    
    // Insert at beginning
    public void insertFront(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = head;
        head = newNode;
    }
    
    // Print the list
    public void printList() {
        Node<T> current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
    
    // Search for an element
    public boolean search(T key) {
        Node<T> current = head;
        while (current != null) {
            if (current.data.equals(key)) {
                return true;
            }
            current = current.next;
        }
        return false;
    }
}`
};

export const linkedListUseCases = [
  {
    title: "Dynamic Memory Management",
    description: "Linked lists allow for efficient memory allocation and deallocation, making them ideal for systems with dynamic memory requirements."
  },
  {
    title: "Undo/Redo Operations",
    description: "Applications can use linked lists to implement undo/redo functionality by maintaining a history of operations."
  },
  {
    title: "Music Playlist",
    description: "Music players often use linked lists to manage playlists, allowing for easy insertion and removal of songs."
  },
  {
    title: "Task Scheduling",
    description: "Operating systems use linked lists for task scheduling and managing process queues."
  }
];

export const linkedListRelatedProblems = [
  {
    id: "lc-206",
    title: "Reverse Linked List",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/reverse-linked-list/"
  },
  {
    id: "lc-21",
    title: "Merge Two Sorted Lists",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/"
  },
  {
    id: "lc-141",
    title: "Linked List Cycle",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/linked-list-cycle/"
  },
  {
    id: "lc-19",
    title: "Remove Nth Node From End of List",
    platform: "leetcode",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
  },
  {
    id: "lc-23",
    title: "Merge k Sorted Lists",
    platform: "leetcode",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/merge-k-sorted-lists/"
  }
];
