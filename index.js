let commentIndex = 1;

function getUniqueIndex() {
  return commentIndex++;
}

function getReplyUniqueIndex() {
  return new Date().getTime();
}


let comments = [];


let parentNestedComments = document.getElementsByClassName('parent-nested-comments')[0];

function attachMainCommentBox() {
  let mainCommentBox = document.createElement('div');
  mainCommentBox.className = 'main-comment-box';
  
  let mainCommentInput = document.createElement('input');
  mainCommentInput.className = 'main-comment-input';
  mainCommentInput.placeholder = 'Type Here'
  mainCommentBox.appendChild(mainCommentInput);  

  let mainCommentButton = document.createElement('button');
  mainCommentButton.className = 'main-comment-button';
  mainCommentButton.innerHTML = 'Comment'
  mainCommentButton.addEventListener('click', function() {
    
    let comment = {
      id: getUniqueIndex(),
      value: mainCommentInput.value,
      replies: []
    };
    comments.push(comment);
    
    addCommentItem(comment, nestedComments, false);
    
    mainCommentInput.value = '';
    
  });
  mainCommentBox.appendChild(mainCommentButton);
  
  parentNestedComments.appendChild(mainCommentBox);
}

attachMainCommentBox();

let nestedComments = document.createElement('div');
nestedComments.className = 'nested-comments';
parentNestedComments.appendChild(nestedComments);

function addReply(parentArray, id, reply) {
  if (parentArray) {
    parentArray.map(comment => {
    
      if (comment.id == id) {
        return comment.replies.push(reply)
      } else {
        addReply(comment.replies, id, reply);
      }
    });
  }
  
  localStorage.setItem('nested-comments', JSON.stringify(comments));
}

function addReplyBox(id) {
  let parentCommentItem =  document.getElementsByClassName('comment-item-' + id)[0];
  
  let replyBox = document.createElement('div');
  replyBox.className = 'reply-box reply-box-' + id;
  
  let replyInput = document.createElement('input');
  replyInput.className = 'reply-input';
  replyInput.placeholder = 'Type Here'
  replyBox.appendChild(replyInput);  

  let replyButton = document.createElement('button');
  replyButton.className = 'reply-button reply-button-' + id;
  replyButton.id = id;
  replyButton.innerHTML = 'Reply'
  replyButton.addEventListener('click', function() {
    
    let reply = {
      id: id + "-" + getReplyUniqueIndex(),
      value: replyInput.value,
      replies: []
    };
    
    let itemId = this.id;
    addReply(comments, itemId, reply);
    addCommentItem(reply, parentCommentItem, true);
    
    replyInput.value = '';
    
    parentCommentItem.removeChild(replyBox);
    
  });
  replyBox.appendChild(replyButton);
 
  parentCommentItem.insertBefore(replyBox, parentCommentItem.children[2]);
}

function addCommentItem(comment, parent, isReply) {
  let id = comment.id;
  
  let commentItem = document.createElement('div');
  if (isReply) {
    commentItem.className = 'comment-item reply-item comment-item-' + id;
  } else {
    commentItem.className = 'comment-item comment-item-' + id;
  }
  
  let commentItemTop = document.createElement('div');
  commentItemTop.className = 'comment-item-top';
  
  let commentItemName = document.createElement('span');
  commentItemName.className = 'comment-item-name';
  commentItemName.innerHTML = 'Name:';
  commentItemTop.appendChild(commentItemName);
  
  let commentItemText = document.createElement('span');
  commentItemText.className = 'comment-item-text';
  commentItemText.innerHTML = comment.value;
  commentItemTop.appendChild(commentItemText);
  
  commentItem.appendChild(commentItemTop);
  
  let commentItemReply = document.createElement('button');
  commentItemReply.className = 'comment-item-reply comment-item-reply-' + id;
  commentItemReply.id = id;
  commentItemReply.innerHTML = 'Reply';
  commentItemReply.addEventListener('click', function() {
    let itemId = this.id;
    
    let replyBox = document.getElementsByClassName('reply-box');
    if (replyBox.length > 0) {
      replyBox[0].parentElement.removeChild(replyBox[0]);
    }
    
    addReplyBox(itemId);
  });
  commentItem.appendChild(commentItemReply);
  
  parent.appendChild(commentItem);
  
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.map(reply => {
      addCommentItem(reply, commentItem, true);
    });
  }
}

function prepareUI() {
  comments.map(comment => {
    addCommentItem(comment, nestedComments, false);
  });
}

let localComments = JSON.parse(localStorage.getItem("nested-comments"));
if (localComments && localComments.length > 0) {
  comments = localComments;
  
  prepareUI();
}