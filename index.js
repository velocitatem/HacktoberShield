const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const openaiApiKey = core.getInput('openai_api_key');
        const githubToken = core.getInput('github_token');
        const octokit = github.getOctokit(githubToken);
        const actor = github.context.actor;

        core.debug(`Actor: ${actor}`);

        let diffs = '', spamLikelihood = 0;

        try {
            // fetch the spam likelihood
            let response = await fetch(`https://790a-2a0c-5a80-1f10-3f00-2506-17cf-1cfe-ba07.ngrok-free.app/check?username=${actor}`);
            response = await response.text();
            core.debug(response);
            if (response !== 'Not spam') {
                spamLikelihood = response.split('%')[0];
            } else {
                spamLikelihood = 0;
            }

        } catch (error) {

        }

        try {
            // fetch the diffs
            const { data } = await octokit.repos.compareCommits({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                base: 'origin/main',
                head: 'HEAD'
            });

            diffs = data.files.map(file => file.patch).join('\n');

            core.debug(diffs);

        } catch (err) {

        }

        const prompt = `Your job is to review the following PR and determine if it is spam or not. It is currently hacktober-fest and there is a lot of spam going around. Many users are creating PRs that do not contribute anything very valuable. Here is the PR diff: \n ${diffs} \n Is this PR spam or not? Return one of the following:\nSpam\nNot spam`;

        const messagesPayload = JSON.stringify([
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ]);

        core.debug(`Messages payload: ${messagesPayload}`);



    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
