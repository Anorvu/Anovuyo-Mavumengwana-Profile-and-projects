exports.handler = async (event) => {
    try {
        // 1. Get the form submission data from Netlify
        const payload = JSON.parse(event.body).payload;
        const { name, email, message } = payload.data;

        // 2. Prepare the GitHub API request
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_REPO = "Anorvu/Anovuyo-Mavumengwana-Profile-and-projects";

        if (!GITHUB_TOKEN) {
            console.error("GITHUB_TOKEN is missing in environment variables.");
            return { statusCode: 500, body: "Server Configuration Error" };
        }

        // 3. Create the issue in GitHub
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Netlify-Form-Handler"
            },
            body: JSON.stringify({
                title: `Portfolio: Remote Hire Request from ${name}`,
                body: `### New Submission Details\n\n**Name:** ${name}\n**Email:** ${email}\n\n**Message:**\n${message}\n\n---\n*Sent automatically from Netlify Forms*`,
                labels: ["hire-me", "inquiry"]
            })
        });

        if (response.ok) {
            console.log("Successfully created GitHub issue.");
            return { statusCode: 200, body: "Message Stored in GitHub" };
        } else {
            const errorData = await response.json();
            console.error("GitHub API Error:", errorData);
            return { statusCode: 500, body: "Failed to store message in GitHub" };
        }
    } catch (error) {
        console.error("Function Error:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    }
};
