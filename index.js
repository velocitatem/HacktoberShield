const core = require('@actions/core');
const github = require('@actions/github');
const openaiApiKey = core.getInput('openai_api_key');
const githubToken = core.getInput('github_token');
const octokit = github.getOctokit(githubToken);
const axios = require('axios');
const URL = "https://glduc7t8ke.execute-api.eu-north-1.amazonaws.com"


async function spamRegistry(actor) {

    let diffs = '', spamLikelihood = 0;

    try {
        // fetch the spam likelihood
        let response = await axios.get(URL+`/default/handleUserReports?userId=${actor}&action=getCount`);
        response = response.data;
        console.log(response);
        if (response !== 'Not spam') {
            spamLikelihood = response.split('%')[0];
        } else {
            spamLikelihood = 0;
        }

    } catch (error) {
        console.log(error);
    }
    return spamLikelihood;
}


async function reportUser(username) {
        try {
            // report the user
            let response = await axios.get(URL+`/default/handleUserReports?userId=${username}&action=report`);
            response = response.data;
            console.log(response);

        } catch (error) {
            console.log(error);
        }
}

async function getDiffs() {
    let diffs;

    try {
        // fetch the diffs
        const {data: pullRequest} = await octokit.rest.pulls.get({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: github.context.payload.pull_request.number
        });
        console.log(pullRequest);
        let durl = pullRequest.diff_url;
        // diffs = await axios.get(durl);
        try {
            diffs = await axios.get(durl);
        } catch (err) {
            try {
                if (err.response.status === 404) {
                    diffs = await axios.get(durl + '?token=' + githubToken);
                } else { return ''; }
            } catch (err) {
                return '';
            }
        }
        diffs = diffs.data;
        console.log(diffs);

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
