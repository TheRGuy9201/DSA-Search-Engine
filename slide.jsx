import React, { useState } from 'react';

// Import Google Material Icons font link in index.html or public index.html separately
// Example in index.html head:
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

const problemsData = [
    {
        id: 1,
        title: 'Robot Positions',
        status: 'Not Attempted',
        acceptance: 94.5,
        difficulty: 'Medium',
        bookmarked: false,
        topicTags: ['Greedy', 'Math', 'Simulation']
    },
    {
        id: 2,
        title: 'Case Conversion',
        status: 'Not Attempted',
        acceptance: 94.2,
        difficulty: '--',
        bookmarked: false,
        topicTags: ['Strings', 'Parsing']
    },
    {
        id: 3,
        title: 'Replacement',
        status: 'Solved',
        acceptance: 93.9,
        difficulty: 'Novice',
        bookmarked: true,
        topicTags: ['Arrays', 'Dynamic Programming']
    },
    {
        id: 4,
        title: 'Mirror Array',
        status: 'Not Attempted',
        acceptance: 93.3,
        difficulty: 'Novice',
        bookmarked: false,
        topicTags: ['Arrays', 'Two Pointers']
    },
    {
        id: 5,
        title: 'Encode All',
        status: 'Not Attempted',
        acceptance: 93.2,
        difficulty: '--',
        bookmarked: false,
        topicTags: ['Strings', 'Compression']
    },
];

const statusOptions = ['All', 'Not Attempted', 'Solved'];
const difficultyOptions = ['All', 'Novice', 'Medium', 'Hard'];

export default function SlidingTable() {
    const [filters, setFilters] = useState({
        topic: '',
        status: 'All',
        difficulty: 'All',
        bookmarkedOnly: false,
        showTopicTags: false,
        searchTerm: '',
    });

    // Toggle bookmark state for problem by id
    const toggleBookmark = (id) => {
        const index = problemsData.findIndex(p => p.id === id);
        if (index >= 0) {
            problemsData[index].bookmarked = !problemsData[index].bookmarked;
            setFilters({ ...filters }); // Trigger rerender by updating state
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Filter problems array based on state filters
    const filteredProblems = problemsData.filter(problem => {
        if (
            filters.topic &&
            !problem.topicTags.some(tag => tag.toLowerCase().includes(filters.topic.toLowerCase()))
        ) {
            return false;
        }
        if (filters.status !== 'All' && problem.status !== filters.status) return false;
        if (filters.difficulty !== 'All' && problem.difficulty !== filters.difficulty) return false;
        if (filters.bookmarkedOnly && !problem.bookmarked) return false;
        if (filters.searchTerm) {
            const lowerSearch = filters.searchTerm.toLowerCase();
            if (!problem.title.toLowerCase().includes(lowerSearch)) return false;
        }
        return true;
    });

    // Status icon component
    const StatusIcon = ({ status }) => {
        if (status === 'Solved') {
            return <span className="material-icons status-solved" title="Solved">check_circle</span>;
        } else if (status === 'Not Attempted') {
            return <span className="material-icons status-notattempted" title="Not Attempted">radio_button_unchecked</span>;
        }
        return <span>{status}</span>;
    };

    // Bookmark icon component
    const BookmarkIcon = ({ bookmarked }) => {
        return (
            <span className="material-icons bookmark-icon" title={bookmarked ? 'Bookmarked' : 'Bookmark'}>
                {bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
        );
    };

    return (
        <>
            <div className="filter-bar">
                <select
                    aria-label="Filter by Topic"
                    value={filters.topic}
                    onChange={(e) => handleFilterChange('topic', e.target.value)}
                    className="filter-select"
                    placeholder="Topics"
                >
                    <option value="">All Topics</option>
                    {/* Could populate dynamic unique topic tags but keeping simple */}
                    <option value="arrays">Arrays</option>
                    <option value="strings">Strings</option>
                    <option value="math">Math</option>
                    <option value="dynamic programming">Dynamic Programming</option>
                    <option value="greedy">Greedy</option>
                    <option value="simulation">Simulation</option>
                    <option value="parsing">Parsing</option>
                    <option value="compression">Compression</option>
                    <option value="two pointers">Two Pointers</option>
                </select>

                <select
                    aria-label="Filter by Status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="filter-select"
                >
                    {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <select
                    aria-label="Filter by Difficulty"
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="filter-select"
                >
                    {difficultyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={filters.bookmarkedOnly}
                        onChange={() => handleFilterChange('bookmarkedOnly', !filters.bookmarkedOnly)}
                    /> Bookmarked Question
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={filters.showTopicTags}
                        onChange={() => handleFilterChange('showTopicTags', !filters.showTopicTags)}
                    /> Show Topic Tags
                </label>

                <input
                    type="search"
                    aria-label="Search problems"
                    placeholder="Search for the name of the problem"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="search-input"
                />

                <button
                    onClick={() => { }}
                    className="btn-search"
                    aria-label="Search"
                >
                    Search
                </button>
            </div>

            <div className="table-container" role="table" aria-label="Problems table">
                <div className="table-header" role="rowgroup">
                    <div className="table-row header" role="row">
                        <div className="table-cell title" role="columnheader" tabIndex={0}>TITLE</div>
                        <div className="table-cell status" role="columnheader" tabIndex={0}>STATUS</div>
                        <div className="table-cell acceptance" role="columnheader" tabIndex={0}>ACCEPTANCE</div>
                        <div className="table-cell difficulty" role="columnheader" tabIndex={0}>DIFFICULTY</div>
                        <div className="table-cell bookmark" role="columnheader" tabIndex={0}>BOOKMARK</div>
                    </div>
                </div>
                <div className="table-body" role="rowgroup">
                    {filteredProblems.length === 0 ? (
                        <div className="no-results" role="row">
                            <div className="table-cell no-data" colSpan="5">No matching problems found.</div>
                        </div>
                    ) : (
                        filteredProblems.map((problem, idx) => (
                            <React.Fragment key={problem.id}>
                                <div
                                    className={`table-row ${idx % 2 === 0 ? 'even' : 'odd'}`}
                                    role="row"
                                >
                                    <div className="table-cell title" role="cell">
                                        <strong>{problem.title}</strong>
                                    </div>
                                    <div className="table-cell status" role="cell">
                                        <StatusIcon status={problem.status} />
                                        <span className={`status-text ${problem.status === 'Solved' ? 'solved' : 'not-attempted'}`}>
                                            {problem.status}
                                        </span>
                                    </div>
                                    <div className="table-cell acceptance" role="cell">
                                        {problem.acceptance.toFixed(1)}%
                                    </div>
                                    <div className="table-cell difficulty" role="cell">
                                        <span className={`difficulty-label difficulty-${problem.difficulty.toLowerCase().replace(' ', '-')}`}>
                                            {problem.difficulty === '--' ? '--' : problem.difficulty}
                                        </span>
                                    </div>
                                    <div className="table-cell bookmark" role="cell" tabIndex={0} onClick={() => toggleBookmark(problem.id)} onKeyDown={(e) => { if (e.key === 'Enter') toggleBookmark(problem.id); }} style={{ cursor: 'pointer' }}>
                                        <BookmarkIcon bookmarked={problem.bookmarked} />
                                    </div>
                                </div>
                                {filters.showTopicTags && (
                                    <div className="table-row topic-tags-row" role="row">
                                        <div className="table-cell topic-tags-cell" role="cell" colSpan={5}>
                                            {problem.topicTags.map((tag, tIdx) => (
                                                <span key={tIdx} className="topic-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </div>
            </div>

            <style>{`
        /* Material Icons font must be included separately in index.html */
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background: #f9fbfd;
          color: #333;
        }
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px;
          background: #e8f0fe;
          border-radius: 12px;
          align-items: center;
          margin: 24px auto;
          max-width: 1200px;
        }
        .filter-select {
          padding: 10px 12px;
          border: 1px solid #a3c0f9;
          border-radius: 8px;
          background: white;
          color: #444;
          min-width: 140px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }
        .filter-select:focus {
          outline: none;
          border-color: #4f84ff;
          box-shadow: 0 0 8px rgba(79, 132, 255, 0.5);
        }
        .checkbox-label {
          font-size: 14px;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #2f4f94;
          cursor: pointer;
          font-weight: 600;
        }
        .search-input {
          flex-grow: 1;
          min-width: 220px;
          padding: 10px 14px;
          border: 1px solid #a3c0f9;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #4f84ff;
          box-shadow: 0 0 8px rgba(79, 132, 255, 0.5);
        }
        .btn-search {
          background: #5a86ff;
          border: none;
          color: white;
          font-weight: 600;
          padding: 10px 26px;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .btn-search:hover, .btn-search:focus {
          background: #3b62da;
          outline: none;
        }

        .table-container {
          max-width: 1200px;
          margin: 0 auto 48px auto;
          border-radius: 16px;
          overflow-x: auto;
          background: white;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .table-header {
          background: #e9f0ff;
          border-bottom: 1px solid #a3c0f9;
          user-select: none;
        }

        .table-row {
          display: grid;
          grid-template-columns: minmax(150px, 3fr) 1.5fr 1fr 1.5fr 1fr;
          align-items: center;
          padding: 12px 24px;
          gap: 12px;
          border-bottom: 1px solid #f3f6ff;
          font-size: 14px;
          transition: background 0.25s ease;
        }
        .table-row.even {
          background: #f0f7ff;
        }
        .table-row:hover {
          background: #d2e1ff;
        }
        .table-row.header {
          font-weight: 700;
          color: #53618e;
          font-size: 13px;
          border-bottom: 1.5px solid #4f84ff;
          text-transform: uppercase;
        }

        .table-cell {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .title {
          font-weight: 700;
          font-size: 15px;
          color: #1f2937;
        }
        .status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-text {
          font-weight: 600;
        }
        .status-solved {
          color: #3aa363;
          font-size: 20px;
        }
        .status-notattempted {
          color: #687993;
          font-size: 20px;
        }
        .acceptance {
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: #4a4a4a;
        }
        .difficulty-label {
          font-weight: 700;
          white-space: normal;
          text-align: center;
          padding: 6px 14px;
          border-radius: 16px;
          display: inline-block;
          user-select: none;
        }
        .difficulty-novice {
          background: #daf3d6;
          color: #639a67;
        }
        .difficulty-medium {
          background: #fff3c5;
          color: #bd9c25;
        }
        .difficulty-hard {
          background: #f7dcdc;
          color: #c85454;
        }

        .bookmark {
          text-align: center;
          cursor: pointer;
          user-select: none;
          font-size: 20px;
          color: #4a4a4a;
          transition: color 0.3s ease;
        }
        .bookmark:hover {
          color: #5a86ff;
        }

        /* Topic tags row underneath a problem */
        .topic-tags-row {
          background: #eef6ff;
          padding-left: 32px;
        }
        .topic-tags-cell {
          padding: 10px 0;
        }
        .topic-tag {
          display: inline-block;
          margin-right: 12px;
          margin-bottom: 6px;
          padding: 6px 12px;
          background: #dbe9ff;
          border-radius: 14px;
          font-size: 12px;
          color: #4969c4;
          font-weight: 600;
        }

        /* Responsive adjustments */
        @media (max-width: 767px) {
          .filter-bar {
            flex-direction: column;
            gap: 12px;
          }
          .table-row {
            grid-template-columns: 1fr 1.5fr 1fr;
            grid-template-areas:
              "title title bookmark"
              "status acceptance acceptance"
              "difficulty difficulty difficulty";
            padding: 12px 16px;
            font-size: 13px;
          }
          .table-cell.title {
            grid-area: title;
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
          }
          .table-cell.status {
            grid-area: status;
            margin-top: 6px;
          }
          .table-cell.acceptance {
            grid-area: acceptance;
            margin-top: 6px;
            font-weight: 700;
            color: #4a4a4a;
          }
          .table-cell.difficulty {
            grid-area: difficulty;
            margin-top: 8px;
          }
          .table-cell.bookmark {
            grid-area: bookmark;
            font-size: 24px;
            align-self: start;
            justify-self: end;
            padding-right: 16px;
          }
          .topic-tags-cell {
            padding-left: 8px;
          }
        }
      `}</style>
        </>
    );
}

