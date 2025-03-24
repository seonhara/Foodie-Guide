import { useEffect, useState, useRef } from 'react'
import { recommendations } from '@/api/recommendations'
import { langchain } from '@/api/langchain'
import Message from '@/components/Message'
import CommonBtn from '@/components/CommonBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home = () => {
  const [messageList, setMessageList] = useState([])
  const [buttonList, setButtonList] = useState([])
  const [userInput, setUserInput] = useState('')
  const messageEndRef = useRef(null)

  const addMessageList = (input) => {
    const newMessage = {
      fromWho: 'user',
      type: 'text',
      cont: input,
    }
    setMessageList((prev) => [...prev, newMessage])
    setUserInput('')
  }
  const getModelResult = async (query) => {
    const result = await langchain(query)
    console.log('result', result.reply)
    const newMessage = {
      fromWho: 'bot',
      type: 'text',
      cont: result.reply,
    }
    setMessageList((prev) => [...prev, newMessage])
  }

  const getBotReply = async (event, user_message) => {
    event.preventDefault()
    addMessageList(user_message)
    await getModelResult(user_message)
  }

  useEffect(() => {
    setMessageList([
      {
        fromWho: 'user',
        type: 'text',
        cont: 'Oh yeah, did Michael Jordan tell you that?',
      },
      {
        fromWho: 'bot',
        type: 'text',
        cont: "When you're backed against the wall, break the god damn thing down.",
      },
      {
        fromWho: 'bot',
        type: 'list',
        cont: [
          {
            imgPath: 'http://emilcarlsson.se/assets/mikeross.png',
            title: 'data.title',
            address: 'data.address',
            link: 'data.link',
          },
          {
            imgPath: 'http://emilcarlsson.se/assets/mikeross.png',
            title: 'data.title.2222',
            address: 'data.address.2222',
            link: 'data.link.2222',
          },
        ],
      },
    ])
    setButtonList([
      {
        type: 'button',
        text: '배아픔',
        message: '나 배가 아픈데 어떤 걸 먹어야 될까?',
      },
      {
        type: 'button',
        text: '두드러기',
        message: '몸에 두드러기가 났어. 뭘 먹어야 될까?',
      },
      {
        type: 'link',
        text: '맵 링크',
        linkTo: '/map',
      },
    ])
  }, [])

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messageList])

  return (
    <div id="frame">
      <div id="sidepanel">
        {buttonList.map((item, index) => {
          return <CommonBtn type={item.type} text={item.text} linkTo={item.linkTo ? item.linkTo : ''} onClick={(event) => getBotReply(event, item.message)} key={index} />
        })}
      </div>
      <div className="content">
        <div className="messages">
          <div>
            {messageList.map((item, index) => {
              return <Message fromWho={item.fromWho} type={item.type} cont={item.cont} key={index} />
            })}
          </div>
          <div ref={messageEndRef}></div>
        </div>
        <div className="message-input">
          <div className="wrap">
            <form onSubmit={(event) => getBotReply(event, userInput)}>
              <input type="text" placeholder="Write your message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} />
              <button className="submit">
                <FontAwesomeIcon icon="fa-solid fa-paper-plane" className="fa fa-paperclip attachment" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
