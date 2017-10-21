const URL_REG = /https:\/\/github\.com\/(\w+)\/(\w+)\/issues\/(\d+)/;
const API_URL = 'https://sky90210.mybluemix.net/api/tones';

// check url in intervals because HTML5 navigation is dynamic
function check() {
  if (URL_REG.test(location.href)) {
    init();
  }
  setTimeout(check, 1000);
}


const fakeData = [{"id":219164536,"parts":[{"text":"Members can submit pull requests so that the copilot will have less work.","score":0.52029},{"text":"I believe it will reduce the number of invalid responses in the Review phase.","score":0.666762}]},{"id":299266989,"parts":[{"text":"Also, some things are confusing for submitters.","score":0.772046},{"text":"They read the spec, some points are valid, some points are invalid, and the forum discussion overrides some points.","score":0.768207},{"text":"It happens very often that they miss something.","score":0.642928},{"text":"As a submitter, I sometimes need to spend a few minutes to find a proper thread and appeal invalid response.","score":0.737597},{"text":"I remember some copilots tried to update specification and keep it up to date in the past.","score":0.563583},{"text":"I don't like a separate changelog file.","score":0.560576}]}];



function init() {
  const node = document.querySelector('.js-issue-title');
  if (!node || node.attributes['data-sadness']) {
    return;
  }
  node.attributes['data-sadness'] = '1';
  const parts = URL_REG.exec(location.href);
  const org = parts[1];
  const repo = parts[2];
  const issueId = Number(parts[3]);

//  highlight(fakeData);
//  return;
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({org, repo, issueId})
  })
    .then((res) => res.json())
    .then(highlight)
    .catch((e) => {
      console.error(e);
      console.error(e.stack);
    });
}

function getCommentNode(id) {
  return document.getElementById('issue-' + id) ||
    document.getElementById('issuecomment-' + id);
}

function highlight(comments) {
  comments.forEach((comment) => {
    console.log('processing:', comment.id);
    const node =getCommentNode(comment.id);
    if (!node) {
      console.log('no node:', comment.id);
      return;
    }
    const markInstance = new Mark(node);
    comment.parts.forEach((part) => {
      console.log('marking', part);
      markInstance.mark(part.text, {acrossElements: true, separateWordSearch: false});
    })
  });
}

check();