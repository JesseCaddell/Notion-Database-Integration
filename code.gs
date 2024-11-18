const NOTION_TOKEN = 'NOTION_API_KEY';

// Mapping of project names to database IDs
const DATABASE_IDS = {
  "DATABASE_NAME": "DATABASE_ID",
  "DATABASE_NAME": "DATABASE_ID",
  "DATABASE_NAME": "DATABASE_ID",
  "DATABASE_NAME": "DATABASE_ID",
  "DATABASE_NAME": "DATABASE_ID",
  "DATABASE_NAME": "DATABASE_ID",
  "DATABASE_NAME": "DATABASE_ID"
};

function onFormSubmit(e) {
  const response = e.values; // Capture form responses as an array
  
  const rawTimestamp = response[0]; // Timestamp from form submission
  const projectId = response[1]; // Project ID is now the title
  const clientName = response[2];
  const pmName = response[3];
  const interactionType = response[4];
  const keyPoints = response[5];
  const actionItems = response[6];
  const risks = response[7];
  const followUp = response[8];
  const attachments = response[9] || ""; // Default to empty string if no attachment

  // Convert Timestamp to ISO format
  const timestamp = new Date(rawTimestamp).toISOString();

  // Get the appropriate database ID
  const databaseId = DATABASE_IDS[projectId];
  if (!databaseId) {
    console.error(`No database found for project: ${projectId}`);
    return;
  }

  // Prepare properties for Notion
  const data = {
    parent: { database_id: databaseId },
    properties: {
      "Project ID": { title: [{ text: { content: projectId } }] }, // Use Project ID as title
      "Timestamp": { date: { start: timestamp } }, // Use ISO-formatted timestamp
      "Client Name": { rich_text: [{ text: { content: clientName } }] },
      "PM or Team Contact": { rich_text: [{ text: { content: pmName } }] },
      "Interaction Type": { rich_text: [{ text: { content: interactionType } }] },
      "Key Discussion Points": { rich_text: [{ text: { content: keyPoints } }] },
      "Action Items or Decisions Made": { rich_text: [{ text: { content: actionItems } }] },
      "Risks or Issues Identified": { rich_text: [{ text: { content: risks } }] },
      "Follow-up Needed?": { rich_text: [{ text: { content: followUp } }] }
    }
  };

  // Add attachments only if they exist
  if (attachments.trim() !== '') {
    data.properties["Attachments/Links"] = { url: attachments };
  }

  const options = {
    method: 'post',
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    payload: JSON.stringify(data),
    muteHttpExceptions: true // Log full responses for debugging
  };

  try {
    const response = UrlFetchApp.fetch(`https://api.notion.com/v1/pages`, options);
    Logger.log(response.getContentText()); // Log the full response
  } catch (error) {
    Logger.log(`Error: ${error}`);
  }
}
