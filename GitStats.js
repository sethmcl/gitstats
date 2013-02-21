/**
 * @author Seth McLaughlin
 */
var GitHubApi = require('github'),
    date = require('./date');

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
};

/**
 * Initialize application
 * @param {Array} args the command line arguments
 */
GitStats.prototype.init = function (args) {
  var client,
      user = args[2],
      repo = args[3],
      days = args[4] || 7,
      fmt  = args[5] || args[4];

  client = new GitHubApi({
    version: '3.0.0'
  });

  var format = require('./' + fmt).formatIssue;

  var since = new Date(new Date() - (1000 * 60 * 60 * 24 * days));
  var issueCount = 0;
  client.issues.repoIssues({
    filter: 'all',
    user: user,
    repo: repo,
    state: 'closed',
    sort: 'updated',
    direction: 'asc',
    since: since.toISOString()
  }, function(err, res) {
    res.filter(function(issue) {
      return new Date(issue.closed_at) >= since;
    })
    .map(function(issue) {
      return format(issue);
    })
    .sort(function(a, b) {
      if(a.str.indexOf('(PR)') !== -1) {
        return 1;
      } else if(b.str.indexOf('(PR') !== -1) {
        return -1;
      } else {
        return a.issue.number - b.issue.number;
      }
    })
    .forEach(function(line) {
      console.log(line.str);
      issueCount++;
    });

    console.log(repo, 'issues closed since', since.toISOString(), '(' + issueCount + ')');
  });

};

module.exports = GitStats;
Object.seal(module.exports);
