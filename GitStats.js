/**
 * @author Seth McLaughlin
 */
var GitHubApi = require('github');

/**
 * Application object
 */
function GitStats() {}

/**
 * Start the App
 * @params {Array} args the command line arguments
 */
GitStats.prototype.run = function(args) {
  this.init(args);
};

/**
 * Stop the app
 */
GitStats.prototype.shutdown = function() {
  throw new Error('Not implemented');
}

/**
 * Initialize application
 * @param {Array} args the command line arguments
 */
GitStats.prototype.init = function (args) {
  var client,
      user = args[2],
      repo = args[3];

  client = new GitHubApi({
    version: '3.0.0'
  });

  var since = new Date(new Date() - (1000 * 60 * 60 * 24 * 7));
  client.issues.repoIssues({
    filter: 'all',
    user: user,
    repo: repo,
    state: 'closed',
    sort: 'updated',
    direction: 'asc',
    since: since.toISOString()
  }, function(err, res) {
    console.log(repo, 'issues closed since', since.toISOString(), '(' + res.length + ')');
    res.forEach(function(issue) {
      if(issue.pull_request.diff_url == null) {
        console.log('[#' + issue.number + '](' + issue.url + ')', issue.title);
      } else {
        console.log('[PULL-REQUEST #' + issue.number + '](' + issue.url + ')', issue.title);
      }
    });
  });

};

module.exports = GitStats;
Object.seal(module.exports);
