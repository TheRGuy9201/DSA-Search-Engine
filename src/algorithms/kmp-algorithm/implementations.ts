export const kmpImplementations = {
  c: `
void computeLPS(char* pattern, int M, int* lps) {
    int len = 0;
    lps[0] = 0;  // lps[0] is always 0
 
    int i = 1;
    while (i < M) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}

void KMPSearch(char* pattern, char* text) {
    int M = strlen(pattern);
    int N = strlen(text);
 
    int lps[M];
    computeLPS(pattern, M, lps);
 
    int i = 0;  // index for text[]
    int j = 0;  // index for pattern[]
    while (i < N) {
        if (pattern[j] == text[i]) {
            j++;
            i++;
        }
 
        if (j == M) {
            printf("Found pattern at index %d\\n", i - j);
            j = lps[j - 1];
        } else if (i < N && pattern[j] != text[i]) {
            if (j != 0)
                j = lps[j - 1];
            else
                i = i + 1;
        }
    }
}
`,

  cpp: `
void computeLPS(string pattern, vector<int>& lps) {
    int m = pattern.length();
    int len = 0;
    
    lps[0] = 0;  // lps[0] is always 0
    
    int i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}

vector<int> kmpSearch(string text, string pattern) {
    vector<int> result;
    int n = text.length();
    int m = pattern.length();
    
    if (m == 0) return result;
    
    // Preprocess the pattern
    vector<int> lps(m, 0);
    computeLPS(pattern, lps);
    
    int i = 0;  // index for text[]
    int j = 0;  // index for pattern[]
    
    while (i < n) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (j == m) {
            // Found pattern at index i-j
            result.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            // Mismatch after j matches
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}
`,

  python: `
def compute_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    
    length = 0
    i = 1
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps

def kmp_search(text, pattern):
    if not pattern:
        return []
        
    n, m = len(text), len(pattern)
    result = []
    
    # Compute LPS array
    lps = compute_lps(pattern)
    
    i = 0  # index for text
    j = 0  # index for pattern
    
    while i < n:
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == m:
            # Found a match
            result.append(i - j)
            j = lps[j - 1]
        elif i < n and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return result
`,

  java: `
void computeLPS(String pattern, int[] lps) {
    int m = pattern.length();
    int len = 0;
    
    lps[0] = 0; // lps[0] is always 0
    
    int i = 1;
    while (i < m) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}

List<Integer> kmpSearch(String text, String pattern) {
    List<Integer> result = new ArrayList<>();
    int n = text.length();
    int m = pattern.length();
    
    if (m == 0) return result;
    
    // Preprocess the pattern
    int[] lps = new int[m];
    computeLPS(pattern, lps);
    
    int i = 0; // index for text
    int j = 0; // index for pattern
    
    while (i < n) {
        if (pattern.charAt(j) == text.charAt(i)) {
            j++;
            i++;
        }
        
        if (j == m) {
            // Found pattern at index i-j
            result.add(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern.charAt(j) != text.charAt(i)) {
            // Mismatch after j matches
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}
`
};

export const kmpRelatedProblems = [
  {
    id: "28",
    platform: "leetcode",
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"
  },
  {
    id: "459",
    platform: "leetcode",
    title: "Repeated Substring Pattern",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/repeated-substring-pattern/"
  },
  {
    id: "214",
    platform: "leetcode",
    title: "Shortest Palindrome",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/shortest-palindrome/"
  },
  {
    id: "1392",
    platform: "leetcode",
    title: "Longest Happy Prefix",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/longest-happy-prefix/"
  }
];

export const kmpUseCases = [
  {
    title: "String Matching",
    description: "KMP is used for efficient pattern matching in text documents, compilers, IDEs, and other applications where finding substrings is important."
  },
  {
    title: "DNA Sequence Analysis",
    description: "In bioinformatics, KMP is used to find specific gene sequences within larger DNA sequences, enabling faster genomic analysis."
  },
  {
    title: "Plagiarism Detection",
    description: "KMP can be used to detect potential instances of copied text by efficiently finding matching patterns across multiple documents."
  },
  {
    title: "Network Intrusion Detection",
    description: "In cybersecurity, KMP can be used to scan network packets for specific byte patterns that might indicate malicious activity."
  },
  {
    title: "Data Compression",
    description: "Some data compression algorithms use KMP-like pattern matching to identify repeated sequences that can be efficiently encoded."
  }
];
