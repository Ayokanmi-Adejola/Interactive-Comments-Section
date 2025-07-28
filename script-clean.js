// Clean working version
let commentsData = [];
let currentUser = {
    image: { png: "./images/avatars/image-juliusomo.png" },
    username: "juliusomo"
};
let nextId = 5;

// Sample data
const sampleData = [
    {
        id: 1,
        content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: "1 month ago",
        score: 12,
        user: {
            image: { png: "./images/avatars/image-amyrobson.png" },
            username: "amyrobson"
        },
        replies: []
    },
    {
        id: 2,
        content: "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: "2 weeks ago",
        score: 5,
        user: {
            image: { png: "./images/avatars/image-maxblagun.png" },
            username: "maxblagun"
        },
        replies: [
            {
                id: 3,
                content: "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
                createdAt: "1 week ago",
                score: 4,
                replyingTo: "maxblagun",
                user: {
                    image: { png: "./images/avatars/image-ramsesmiron.png" },
                    username: "ramsesmiron"
                }
            },
            {
                id: 4,
                content: "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
                createdAt: "2 days ago",
                score: 2,
                replyingTo: "ramsesmiron",
                user: {
                    image: { png: "./images/avatars/image-juliusomo.png" },
                    username: "juliusomo"
                }
            }
        ]
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Load data
    const saved = localStorage.getItem('commentsData');
    if (saved) {
        const data = JSON.parse(saved);
        commentsData = data.comments;
        currentUser = data.currentUser;
    } else {
        commentsData = sampleData;
        saveData();
    }
    
    renderComments();
    setupEventListeners();
});

// Save to localStorage
function saveData() {
    localStorage.setItem('commentsData', JSON.stringify({
        comments: commentsData,
        currentUser: currentUser
    }));
}

// Render comments
function renderComments() {
    console.log('Rendering comments:', commentsData);
    const container = document.getElementById('comments-container');
    container.innerHTML = '';
    
    const sorted = [...commentsData].sort((a, b) => b.score - a.score);
    
    sorted.forEach(comment => {
        const commentEl = createCommentElement(comment);
        container.appendChild(commentEl);
        
        if (comment.replies && comment.replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.className = 'replies-container';
            
            comment.replies.forEach(reply => {
                const replyEl = createCommentElement(reply, true);
                repliesContainer.appendChild(replyEl);
            });
            
            container.appendChild(repliesContainer);
        }
    });
}

// Create comment element
function createCommentElement(comment, isReply = false) {
    const div = document.createElement('div');
    div.className = 'comment';
    div.dataset.id = comment.id;
    
    const isCurrentUser = comment.user.username === currentUser.username;
    
    div.innerHTML = `
        <div class="vote-container">
            <button class="vote-btn" onclick="vote(${comment.id}, 'up')">
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.148c-.1.1-.149.217-.149.354V6.5c0 .137.05.255.149.354.1.099.217.149.354.149h3.333v3.39c0 .136.05.254.149.353.1.1.217.15.354.15H6.33Z" fill="#C5C6EF"/>
                </svg>
            </button>
            <span class="vote-score">${comment.score}</span>
            <button class="vote-btn" onclick="vote(${comment.id}, 'down')">
                <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/>
                </svg>
            </button>
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <img src="${comment.user.image.png}" alt="${comment.user.username}" class="avatar">
                <span class="username">${comment.user.username}</span>
                ${isCurrentUser ? '<span class="you-badge">you</span>' : ''}
                <span class="timestamp">${comment.createdAt}</span>
            </div>
            <div class="comment-text">
                ${isReply && comment.replyingTo ? `<span class="mention">@${comment.replyingTo}</span> ` : ''}${comment.content}
            </div>
            <div class="comment-actions">
                ${isCurrentUser ? `
                    <button class="action-btn delete-btn" onclick="deleteComment(${comment.id})">
                        <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/>
                        </svg>
                        Delete
                    </button>
                    <button class="action-btn edit-btn" onclick="editComment(${comment.id})">
                        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.875h.094l3.65-.333c.399-.04.773-.216 1.058-.499L13.540 5.175a1.75 1.75 0 0 0-.061-2.303Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/>
                        </svg>
                        Edit
                    </button>
                ` : `
                    <button class="action-btn reply-btn" onclick="showReply(${comment.id})">
                        <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/>
                        </svg>
                        Reply
                    </button>
                `}
            </div>
        </div>
    `;
    
    return div;
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('add-comment-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const textarea = document.getElementById('new-comment-content');
            const content = textarea.value.trim();
            
            if (!content) {
                alert('Please enter a comment');
                return;
            }
            
            const newComment = {
                id: nextId++,
                content: content,
                createdAt: 'now',
                score: 0,
                user: currentUser,
                replies: []
            };
            
            console.log('Adding comment:', newComment);
            commentsData.push(newComment);
            saveData();
            renderComments();
            textarea.value = '';
        });
    }
}

// Voting
function vote(id, direction) {
    const comment = findComment(id);
    if (comment) {
        if (direction === 'up') comment.score++;
        else comment.score--;
        saveData();
        renderComments();
    }
}

// Find comment by ID
function findComment(id) {
    for (let comment of commentsData) {
        if (comment.id === id) return comment;
        if (comment.replies) {
            for (let reply of comment.replies) {
                if (reply.id === id) return reply;
            }
        }
    }
    return null;
}

// Delete comment
function deleteComment(id) {
    document.getElementById('delete-modal').style.display = 'flex';
    window.commentToDelete = id;
}

// Edit comment
function editComment(id) {
    const comment = findComment(id);
    const commentEl = document.querySelector(`[data-id="${id}"] .comment-text`);

    const textarea = document.createElement('textarea');
    textarea.value = comment.content;
    textarea.className = 'edit-textarea';

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'UPDATE';
    updateBtn.className = 'btn btn-primary';
    updateBtn.style.marginTop = '10px';

    commentEl.innerHTML = '';
    commentEl.appendChild(textarea);
    commentEl.appendChild(updateBtn);

    updateBtn.onclick = function() {
        const newContent = textarea.value.trim();
        if (newContent) {
            comment.content = newContent;
            saveData();
            renderComments();
        }
    };
}

// Show reply form
function showReply(id) {
    const commentEl = document.querySelector(`[data-id="${id}"]`);
    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form comment-form';
    replyForm.innerHTML = `
        <img src="${currentUser.image.png}" alt="${currentUser.username}" class="avatar">
        <textarea placeholder="Add a reply..." rows="3"></textarea>
        <button type="button" class="btn btn-primary">REPLY</button>
    `;

    commentEl.insertAdjacentElement('afterend', replyForm);

    const btn = replyForm.querySelector('button');
    btn.onclick = function() {
        const content = replyForm.querySelector('textarea').value.trim();
        if (content) {
            const parentComment = findComment(id);
            const newReply = {
                id: nextId++,
                content: content,
                createdAt: 'now',
                score: 0,
                replyingTo: parentComment.user.username,
                user: currentUser
            };

            const mainComment = commentsData.find(c => c.id === id || c.replies?.some(r => r.id === id));
            if (mainComment) {
                if (!mainComment.replies) mainComment.replies = [];
                mainComment.replies.push(newReply);
                saveData();
                renderComments();
            }
        }
    };
}

// Modal functions
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cancel-delete').onclick = function() {
        document.getElementById('delete-modal').style.display = 'none';
    };

    document.getElementById('confirm-delete').onclick = function() {
        if (window.commentToDelete) {
            // Remove comment
            for (let i = 0; i < commentsData.length; i++) {
                if (commentsData[i].id === window.commentToDelete) {
                    commentsData.splice(i, 1);
                    break;
                }
                if (commentsData[i].replies) {
                    const replyIndex = commentsData[i].replies.findIndex(r => r.id === window.commentToDelete);
                    if (replyIndex !== -1) {
                        commentsData[i].replies.splice(replyIndex, 1);
                        break;
                    }
                }
            }
            saveData();
            renderComments();
        }
        document.getElementById('delete-modal').style.display = 'none';
    };
});
