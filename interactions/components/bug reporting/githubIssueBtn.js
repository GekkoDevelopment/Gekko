import axios from 'axios';
import config from '../../../config';

module.exports = {
  data: { name: "githubIssueBtn" },
  async execute(interaction) {
    const embed = interaction.message.embeds[0]; 
    const fieldValueMap = {};
    
    embed.fields.forEach(field => {
        fieldValueMap[field.name] = field.value;
    });
    
    const apiUrl = config.githubApi.url;
    const token = config.githubApi.token;
    const bugId = fieldValueMap['Bug ID'];
    const guildId = fieldValueMap['Guild ID:'];
    const reportee = fieldValueMap['Reportee'];
    const bugDesc = fieldValueMap['Bug Description'];
    const video = fieldValueMap['Video'];

    const issueData = {
        title: `Bug Report - ${bugId}`,
        body: `## Reportee Details: \n**Username & ID:** \n${reportee} \n**Guild ID:** \n${guildId} \n## Report Details: \n**Bug Description:** \n${bugDesc.replace(/`/g, '')} \n\n**Video:** \n${video.replace(/`/g, '')}`,
        labels: ['bug']
    };
    
    const options = {
        method: 'POST',
        url: apiUrl,
        headers: {
            'authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        data: issueData
    };
    
    const response = await axios(options);
    const issueUrl = response.data.html_url;

    const successEmbed = embeds.get('issueAcceptedEmbed')(interaction, {bugId, issueUrl});
    await interaction.message.edit({ embeds: [successEmbed], components: [] });

  },
};
