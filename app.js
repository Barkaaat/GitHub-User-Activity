console.log('Enter Your GitHub Username: ');

async function fetchGitHubActivity(url) {
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`User Not Found.`);
        process.exit();
    }

    console.log(`Fetch Activity from ${url}`);
    return res.json();
}

function displayActivity(data) {
    if (data.length === 0) {
        console.log("No recent activity found.");
        return;
    }
  
    data.forEach((event) => {
        let action;
        switch (event.type) {
            case "PushEvent":
                const commitCount = event.payload.commits.length;
                action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
                break;
            case "IssuesEvent":
                action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
                break;
            case "WatchEvent":
                action = `Starred ${event.repo.name}`;
                break;
            case "ForkEvent":
                action = `Forked ${event.repo.name}`;
                break;
            case "CreateEvent":
                action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                break;
            default:
                action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
                break;
        }
        console.log(`- ${action}`);
    });
}

process.stdin.on('data', username => {
    username = username.toString().trim();
    let url = `https://api.github.com/users/${username}/events`;
    fetchGitHubActivity(url)
        .then((data) => {
            displayActivity(data);
            process.exit();
        })
        .catch(err => console.error(err));
});