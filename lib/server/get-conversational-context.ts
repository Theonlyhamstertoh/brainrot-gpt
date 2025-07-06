export function getPrevConversationWithQuery(
  messages: any,
  amount: number = 1
) {
  const lastMessages = [] // array of last messages
  for (
    let i = messages.length - 1;
    i >= 0 && lastMessages.length < amount * 2 + 1;
    i--
  ) {
    if (messages[i].role === "assistant" || messages[i].role === "user") {
      lastMessages.unshift(messages[i])
    }
  }

  let conversationString = ""
  for (let i = 0; i < lastMessages.length; i++) {
    conversationString += `${lastMessages[i].role}: ${lastMessages[i].content}\n`
  }

  console.log(conversationString)
  return conversationString
}
