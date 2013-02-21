function formatIssue(issue) {
  if(issue.pull_request.diff_url === null) {
    return {
      issue: issue,
      str: '* [#' + issue.number + '](' + issue.url + ') ' + issue.title
    };
  } else {
    return {
      issue: issue,
      str: '* [#' + issue.number + '](' + issue.url + ') (PR) ' + issue.title
    };
  }
}

module.exports.formatIssue = formatIssue;
