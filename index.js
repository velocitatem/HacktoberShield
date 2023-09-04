const core = require('@actions/core');
const github = require('@actions/github');
const openaiApiKey = core.getInput('openai_api_key');
const githubToken = core.getInput('github_token');
const octokit = github.getOctokit(githubToken);


async function spamRegistry(actor) {

    let diffs = '', spamLikelihood = 0;

    try {
        // fetch the spam likelihood
        let response = await fetch(`https://790a-2a0c-5a80-1f10-3f00-2506-17cf-1cfe-ba07.ngrok-free.app/check?username=${actor}`);
        response = await response.text();
        console.log(response);
        if (response !== 'Not spam') {
            spamLikelihood = response.split('%')[0];
        } else {
            spamLikelihood = 0;
        }

    } catch (error) {

    }
    return spamLikelihood;
}

async function getDiffs() {
    let diffs;

    try {
        // fetch the diffs
        const { data } = await octokit.repos.compareCommits({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            base: 'origin/main',
            head: 'HEAD'
        });

        diffs = data.files.map(file => file.patch).join('\n');

    } catch (err) {
        console.log(err);
    }
    return diffs;
}


async function commentOnPr(commentText) {

    // set env var RESPONSE to the comment text
    core.exportVariable('RESPONSE', commentText);

}

async function run() {
    try {
        const actor = github.context.actor;

        let spamLikelyhood = await spamRegistry(actor);
        console.log(spamLikelyhood);
        let diffs = await getDiffs();
        console.log(diffs);
        commentOnPr(`Spam likelihood: ${spamLikelyhood}%\n\nDiffs:\n${diffs}`);


    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
