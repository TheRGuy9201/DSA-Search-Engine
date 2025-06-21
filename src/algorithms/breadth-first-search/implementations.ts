export const breadthFirstSearchImplementations = {
  c: `
// A BFS implementation using adjacency list
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// A structure to represent a queue
struct Queue {
    int front, rear, size;
    unsigned capacity;
    int* array;
};

// A utility function to create a new Queue
struct Queue* createQueue(unsigned capacity) {
    struct Queue* queue = (struct Queue*)malloc(sizeof(struct Queue));
    queue->capacity = capacity;
    queue->front = queue->size = 0;
    queue->rear = capacity - 1;
    queue->array = (int*)malloc(queue->capacity * sizeof(int));
    return queue;
}

// Queue is full when size becomes equal to the capacity
int isFull(struct Queue* queue) {
    return (queue->size == queue->capacity);
}

// Queue is empty when size is 0
int isEmpty(struct Queue* queue) {
    return (queue->size == 0);
}

// Function to add an item to the queue
void enqueue(struct Queue* queue, int item) {
    if (isFull(queue))
        return;
    queue->rear = (queue->rear + 1) % queue->capacity;
    queue->array[queue->rear] = item;
    queue->size = queue->size + 1;
}

// Function to remove an item from queue
int dequeue(struct Queue* queue) {
    if (isEmpty(queue))
        return -1;
    int item = queue->array[queue->front];
    queue->front = (queue->front + 1) % queue->capacity;
    queue->size = queue->size - 1;
    return item;
}

// This struct represents a directed graph using adjacency list representation
struct Graph {
    int V;    // No. of vertices
    struct AdjList* array;
};

// A structure to represent an adjacency list node
struct AdjListNode {
    int dest;
    struct AdjListNode* next;
};

// A structure to represent an adjacency list
struct AdjList {
    struct AdjListNode* head;  // pointer to head node of list
};

// A utility function to create a new adjacency list node
struct AdjListNode* newAdjListNode(int dest) {
    struct AdjListNode* newNode = (struct AdjListNode*)malloc(sizeof(struct AdjListNode));
    newNode->dest = dest;
    newNode->next = NULL;
    return newNode;
}

// A utility function that creates a graph of V vertices
struct Graph* createGraph(int V) {
    struct Graph* graph = (struct Graph*)malloc(sizeof(struct Graph));
    graph->V = V;
    graph->array = (struct AdjList*)malloc(V * sizeof(struct AdjList));
    
    // Initialize each adjacency list as empty
    for (int i = 0; i < V; ++i)
        graph->array[i].head = NULL;
    
    return graph;
}

// Adds an edge to an undirected graph
void addEdge(struct Graph* graph, int src, int dest) {
    // Add an edge from src to dest
    struct AdjListNode* newNode = newAdjListNode(dest);
    newNode->next = graph->array[src].head;
    graph->array[src].head = newNode;
    
    // Since graph is undirected, add an edge from dest to src also
    newNode = newAdjListNode(src);
    newNode->next = graph->array[dest].head;
    graph->array[dest].head = newNode;
}

// Prints BFS traversal from a given source s
void BFS(struct Graph* graph, int s) {
    // Mark all the vertices as not visited
    bool* visited = (bool*)malloc(graph->V * sizeof(bool));
    for (int i = 0; i < graph->V; i++)
        visited[i] = false;
    
    // Create a queue for BFS
    struct Queue* queue = createQueue(graph->V);
    
    // Mark the current node as visited and enqueue it
    visited[s] = true;
    enqueue(queue, s);
    
    // 'i' will be used to get all adjacent vertices of a vertex
    struct AdjListNode* i;
    
    while (!isEmpty(queue)) {
        // Dequeue a vertex from queue and print it
        s = dequeue(queue);
        printf("%d ", s);
        
        // Get all adjacent vertices of the dequeued vertex s
        // If an adjacent has not been visited, then mark it visited and enqueue it
        for (i = graph->array[s].head; i; i = i->next) {
            if (!visited[i->dest]) {
                visited[i->dest] = true;
                enqueue(queue, i->dest);
            }
        }
    }
    
    free(visited);
    free(queue->array);
    free(queue);
}
`,

  cpp: `
#include <iostream>
#include <list>
#include <queue>
#include <vector>
using namespace std;

class Graph {
    int V;              // Number of vertices
    list<int> *adj;     // Adjacency list

public:
    // Constructor
    Graph(int V) {
        this->V = V;
        adj = new list<int>[V];
    }

    // Destructor
    ~Graph() {
        delete[] adj;
    }

    // Function to add an edge to graph
    void addEdge(int v, int w) {
        adj[v].push_back(w);  // Add w to v's list
    }

    // BFS traversal from a given source s
    void BFS(int s) {
        // Mark all vertices as not visited
        vector<bool> visited(V, false);

        // Create a queue for BFS
        queue<int> q;

        // Mark the current node as visited and enqueue it
        visited[s] = true;
        q.push(s);

        while (!q.empty()) {
            // Dequeue a vertex from queue and print it
            s = q.front();
            cout << s << " ";
            q.pop();

            // Get all adjacent vertices of the dequeued vertex s
            // If an adjacent has not been visited, then mark it visited and enqueue it
            for (auto i = adj[s].begin(); i != adj[s].end(); ++i) {
                if (!visited[*i]) {
                    visited[*i] = true;
                    q.push(*i);
                }
            }
        }
    }
};
`,

  python: `
from collections import defaultdict, deque

class Graph:
    def __init__(self):
        # Default dictionary to store graph
        self.graph = defaultdict(list)
    
    # Function to add an edge to graph
    def add_edge(self, u, v):
        self.graph[u].append(v)
    
    # Function to print BFS traversal from a given source
    def bfs(self, start):
        # Mark all the vertices as not visited
        visited = set()
        
        # Create a queue for BFS
        queue = deque()
        
        # Mark the start node as visited and enqueue it
        visited.add(start)
        queue.append(start)
        
        while queue:
            # Dequeue a vertex from queue and print it
            vertex = queue.popleft()
            print(vertex, end=" ")
            
            # Get all adjacent vertices of the dequeued vertex
            # If an adjacent has not been visited, mark it visited and enqueue it
            for neighbor in self.graph[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

# Example usage
# g = Graph()
# g.add_edge(0, 1)
# g.add_edge(0, 2)
# g.add_edge(1, 2)
# g.add_edge(2, 0)
# g.add_edge(2, 3)
# g.add_edge(3, 3)
# 
# print("BFS traversal starting from vertex 2:")
# g.bfs(2)
`,

  java: `
import java.util.*;

class Graph {
    private int V;                  // Number of vertices
    private LinkedList<Integer>[] adj;  // Adjacency list
    
    // Constructor
    @SuppressWarnings("unchecked")
    Graph(int v) {
        V = v;
        adj = new LinkedList[v];
        for (int i = 0; i < v; ++i)
            adj[i] = new LinkedList<>();
    }
    
    // Function to add an edge to graph
    void addEdge(int v, int w) {
        adj[v].add(w);
    }
    
    // BFS traversal from a given source s
    void BFS(int s) {
        // Mark all the vertices as not visited (false)
        boolean[] visited = new boolean[V];
        
        // Create a queue for BFS
        LinkedList<Integer> queue = new LinkedList<>();
        
        // Mark the current node as visited and enqueue it
        visited[s] = true;
        queue.add(s);
        
        while (!queue.isEmpty()) {
            // Dequeue a vertex from queue and print it
            s = queue.poll();
            System.out.print(s + " ");
            
            // Get all adjacent vertices of the dequeued vertex s
            // If an adjacent has not been visited, mark it visited and enqueue it
            for (int n : adj[s]) {
                if (!visited[n]) {
                    visited[n] = true;
                    queue.add(n);
                }
            }
        }
    }
}
`
};

export const breadthFirstSearchRelatedProblems = [
  {
    id: "200",
    platform: "leetcode",
    title: "Number of Islands",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/number-of-islands/"
  },
  {
    id: "102",
    platform: "leetcode",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
  },
  {
    id: "994",
    platform: "leetcode",
    title: "Rotting Oranges",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/rotting-oranges/"
  },
  {
    id: "117D",
    platform: "codeforces",
    title: "Breadth-First Search",
    difficulty: "Medium",
    url: "https://codeforces.com/problemset/problem/1345/D"
  }
];

export const breadthFirstSearchUseCases = [
  {
    title: "Shortest Path in Unweighted Graphs",
    description: "BFS is used to find the shortest path in unweighted graphs, such as finding the minimum number of moves in a puzzle or game."
  },
  {
    title: "Web Crawlers",
    description: "Web crawlers use BFS to explore web pages by following links from a starting page, discovering and indexing content systematically."
  },
  {
    title: "Social Network Analysis",
    description: "BFS helps analyze social networks to find connections, mutual friends, or determine the degrees of separation between users."
  },
  {
    title: "Garbage Collection",
    description: "In programming languages, BFS is used in garbage collection algorithms to identify and collect unreachable objects in memory."
  }
];
