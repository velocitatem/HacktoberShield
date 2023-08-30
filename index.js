const core = require('@actions/core');
const github = require('@actions/github');
const openai = require('openai');
const openaiApiKey = core.getInput('openai_api_key');
const githubToken = core.getInput('github_token');
const octokit = github.getOctokit(githubToken);

async function aiDiffAnalsis(diffs) {
    const prompt = `Your job is to review the following PR and determine if it is spam or not. It is currently hacktober-fest and there is a lot of spam going around. Many users are creating PRs that do not contribute anything very valuable. Here is the PR diff: \n ${diffs} \n Is this PR spam or not? Return one of the following:\nSpam\nNot spam`;
    const messagesPayload =  [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
    ];

    // get the key from the github secret
    const openaiApiKey = core.getInput('openai_api_key');
    const openaiClient = new openai(openaiApiKey);


    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messagesPayload,
    });

    let textual = response.choices[0];

    console.log(textual);

}

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
}

async function run() {
    try {
        const actor = github.context.actor;

        let spamLikelyhood = await spamRegistry(actor);

        try {
            // fetch the diffs
            const { data } = await octokit.repos.compareCommits({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                base: 'origin/main',
                head: 'HEAD'
            });

            diffs = data.files.map(file => file.patch).join('\n');

            console.log(diffs);

        } catch (err) {

        }




        console.log(`Messages payload: ${messagesPayload}`);



    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
