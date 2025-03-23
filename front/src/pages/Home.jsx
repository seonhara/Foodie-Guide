import { useEffect, useState, useRef } from 'react'
import { getAiagent } from '@/api/getAiagent'
import Message from '@/components/Message'
import CommonBtn from '@/components/CommonBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import sideBtnData from '@/data/sideButton'

const Home = () => {
  const [messageList, setMessageList] = useState([])
  const [buttonList, setButtonList] = useState({})
  const [userInput, setUserInput] = useState('')
  const [timeState, setTimeState] = useState(0)
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
    const result = await getAiagent(query)

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
    setButtonList(sideBtnData)

    // let timer = setTimeout(() => {
    //   setTimeState(-1)
    // }, 2000)
    // return () => {
    //   clearTimeout(timer)
    // }
  }, [])

  useEffect(() => {
    console.log('messageList', messageList)

    messageList.length > 0 && messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    messageList.length > 0 && setTimeState(-1)
  }, [messageList])

  return (
    <div id="frame">
      <div id="sidepanel">
        {/* {buttonList.map((item, index) => {
          return <CommonBtn type={item.type} text={item.text} linkTo={item.linkTo ? item.linkTo : ''} onClick={(event) => getBotReply(event, item.message)} key={index} />
        })} */}
      </div>
      <div className="content">
        <div className="title">
          <div>
            Foodie Guide <span>with ChatGPT</span>
          </div>
          <CommonBtn type="button" text="현재 위치 공유" />
          <div className={timeState === 0 ? 'info show' : 'info'}>
            <p>현재 위치를 공유해 주시면</p>
            <p>당신의 근처 식당을 추천해 드릴게요!</p>
          </div>
        </div>
        <div className="intro">
          <div className={messageList.length > 0 ? 'text-wrap' : 'text-wrap show'}>
            <p>맛있는 메뉴와 식당을 추천해 드릴게요!</p>
            <p>당신의 상태를 설명해주세요.</p>
            <p>🍚 🌮 🥘 🍔 🍣 🍜</p>
          </div>
        </div>
        <div className="messages">
          {messageList.length > 0 && (
            <>
              <div>
                {messageList.map((item, index) => {
                  return <Message fromWho={item.fromWho} type={item.type} cont={item.cont} key={index} />
                })}
              </div>
              <div ref={messageEndRef}></div>
            </>
          )}
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
