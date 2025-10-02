require('dotenv').config();
const { Client, GatewayIntentBits, channelLink, VoiceChannel, messageLink } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,          
    GatewayIntentBits.GuildMessages,   
    GatewayIntentBits.MessageContent,  
    GatewayIntentBits.GuildVoiceStates 
  ]

  

});

const commands = [
  '!hello',
  '!kitty',
  '!play',
  '!kde si byl',
  '!ptacek'
]

client.once('ready', () => {
  console.log(`✅Logged in as ${client.user.tag}✅`);
});


client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  const is_command = message.content.trim().split(/ +/);
  const command = is_command[0];

  if (command === '!commands') {
    return message.reply('My commands are \n!play\n!kitty\n!hello\n!kde si byl\n!ptacek');
  }

  if (command === '!hello') {
    return message.reply('zdar pizdo');
  }

  if (command === '!ptacek') {
    const ptacek_quotes = [
      'já to mám v popisu práce',
      'já ji vylížu, vomrdám',
      'teď sem tam měl jednu šlapku',
      'neříkej mi zmrde',
      'to niiic'
    ];
    const nahodna_odpoved =
      ptacek_quotes[Math.floor(Math.random() * ptacek_quotes.length)];

    return message.reply(nahodna_odpoved);
  }

  if (command === '!kitty') {
    const embed = new EmbedBuilder()
      .setTitle('tu máš mačku')
      .setImage('https://cataas.com/cat');

    return message.channel.send({ embeds: [embed] });
  }

  if (command.startsWith('!') && !commands.includes(command)) {
    return message.reply("neplatny command");
  }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!play') || message.author.bot) return;

    const rozdel_url = message.content.trim().split(/\s+/);
    const url = rozdel_url[1];
    if (!url) return message.reply('chybý ti url.\njeste nefunguje');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('napoj se do VC\njeste nefunguje');
    

    const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: false  
});

    try {
        const audio_stream = await play.stream(url);
        const resource = createAudioResource(audio_stream.stream, { inputType: audio_stream.type });
        const audio = createAudioPlayer();

        audio.play(resource);
        connection.subscribe(audio);
        } catch (error) {
        console.error(error);
        message.reply('nejspis spatna url (nejde to).');
    }
});

client.login(process.env.DISCORD_TOKEN);