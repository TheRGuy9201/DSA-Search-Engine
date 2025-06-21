export const depthFirstSearchImplementations = {
  c: `
#define MAX_VERTICES 100

// Graph representation using adjacency list
struct Graph {
    int vertices;
    int* visited;
    int** adj;
};

void DFS(struct Graph* graph, int vertex) {
    graph->visited[vertex] = 1;
    printf("%d ", vertex);
    
    for (int i = 0; i < graph->vertices; i++) {
        if (graph->adj[vertex][i] && !graph->visited[i]) {
            DFS(graph, i);
        }
    }
}`,

  cpp: `
class Graph {
private:
    int V; // number of vertices
    vector<vector<int>> adj;
    vector<bool> visited;
    
public:
    Graph(int vertices) : V(vertices) {
        adj.resize(V);
        visited.resize(V, false);
    }
    
    void addEdge(int v, int w) {
        adj[v].push_back(w);
    }
    
    void DFS(int v) {
        visited[v] = true;
        cout << v << " ";
        
        for (int adjacent : adj[v]) {
            if (!visited[adjacent]) {
                DFS(adjacent);
            }
        }
    }
    
    // DFS traversal starting from vertex v
    void DFSTraversal(int v) {
        fill(visited.begin(), visited.end(), false);
        DFS(v);
    }
};`,

  python: `
class Graph:
    def __init__(self):
        self.graph = {}
    
    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        self.graph[u].append(v)
    
    def dfs_util(self, vertex, visited):
        # Mark current vertex as visited
        visited.add(vertex)
        print(vertex, end=' ')
        
        # Recur for all adjacent vertices
        for neighbor in self.graph.get(vertex, []):
            if neighbor not in visited:
                self.dfs_util(neighbor, visited)
    
    def dfs(self, start_vertex):
        visited = set()
        self.dfs_util(start_vertex, visited)`,

  java: `
class Graph {
    private int V; // number of vertices
    private List<List<Integer>> adj;
    
    Graph(int vertices) {
        V = vertices;
        adj = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adj.add(new ArrayList<>());
        }
    }
    
    void addEdge(int v, int w) {
        adj.get(v).add(w);
    }
    
    void DFSUtil(int v, boolean[] visited) {
        visited[v] = true;
        System.out.print(v + " ");
        
        for (int neighbor : adj.get(v)) {
            if (!visited[neighbor]) {
                DFSUtil(neighbor, visited);
            }
        }
    }
    
    void DFS(int v) {
        boolean[] visited = new boolean[V];
        DFSUtil(v, visited);
    }
}`
};

export const depthFirstSearchUseCases = [
  {
    title: "Maze Solving",
    description: "DFS can find a path through a maze by exploring as far as possible along each branch before backtracking."
  },
  {
    title: "Topological Sorting",
    description: "Used in scheduling dependent tasks and build systems to determine the order of compilation tasks."
  },
  {
    title: "Connected Components",
    description: "Finding connected components in social networks or analyzing network connectivity."
  },
  {
    title: "Web Crawling",
    description: "Web crawlers use DFS to explore web pages by following links in a depth-first manner."
  }
];

export const depthFirstSearchRelatedProblems = [
  {
    id: "lc-200",
    title: "Number of Islands",
    platform: "leetcode",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/number-of-islands/"
  },
  {
    id: "lc-733",
    title: "Flood Fill",
    platform: "leetcode",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/flood-fill/"
  },
  {
    id: "lc-207",
    title: "Course Schedule",
    platform: "leetcode",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/course-schedule/"
  },
  {
    id: "cf-510C",
    title: "Fox And Names",
    platform: "codeforces",
    difficulty: "Medium",
    url: "https://codeforces.com/problemset/problem/510/C"
  },
  {
    id: "lc-417",
    title: "Pacific Atlantic Water Flow",
    platform: "leetcode",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/pacific-atlantic-water-flow/"
  }
];
