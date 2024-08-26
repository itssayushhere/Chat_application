// Function to update channel details (name, image, description)
export const updateChannel = async (channelName, channelImage,channel, channelDescription) => {
  try {
    const updateResponse = await channel.update({
      name: channelName,
      image: channelImage,
      description: channelDescription,
    });
    console.log('Channel updated successfully:', updateResponse);
  } catch (error) {
    console.error('Error updating channel:', error);
  }
};
export const updateimageChannel = async(channel,channelImage)=>{
  const currentChannelName = channel?.data?.name
  const currentChannelDesciption = channel?.data?.description
  try {
    const updateResponse = await channel.update({
      name: currentChannelName,
      image: channelImage,
      description: currentChannelDesciption,
    });
    console.log('Channel updated successfully:', updateResponse);
  } catch (error) {
    console.error('Error updating channel:', error);
  }
}

// Function to add members to the channel
export const addMembersToChannel = async (channel,userIds) => {
  try {
    await channel.addMembers(userIds);
    console.log('Members added successfully');
  } catch (error) {
    console.error('Error adding members:', error);
  }
};

// Function to remove members from the channel
export const removeMembersFromChannel = async (userIds,channel) => {
  try {
    await channel.removeMembers([userIds]);
    console.log('Members removed successfully');
  } catch (error) {
    console.error('Error removing members:', error);
  }
};
