import { useEffect, useState, useRef } from 'react'
import { recommendations } from '@/api/recommendations'
import Message from '@/components/Message'
import CommonBtn from '@/components/CommonBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home = () => {
  const [messageList, setMessageList] = useState([])
  const [userInput, setUserInput] = useState('')
  const messageEndRef = useRef(null)

  const addMessageList = () => {
    // 화면에 메시지 보이기
    const newMessage = {
      fromWho: 'user',
      type: 'text',
      cont: userInput,
    }
    setMessageList((prev) => [...prev, newMessage])
    setUserInput('')
  }
  const getModelResult = async () => {
    // 모델에 쿼리 진송
    const result = await recommendations(userInput)
    console.log('result', result.reply)
    const newMessage = {
      fromWho: 'bot',
      type: 'text',
      cont: result.reply,
    }
    setMessageList((prev) => [...prev, newMessage])

    // setRecommendResult(result.recommendations)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    addMessageList()
    await getModelResult()
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
  }, [])

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messageList])

  return (
    <div id="frame">
      <div id="sidepanel">
        <CommonBtn type="button" text="배가 아픔" />
        <CommonBtn type="link" text="피부 난리남" linkTo="/map" />
      </div>
      <div className="content">
        <div className="contact-profile">
          <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
          <p>Harvey Specter</p>
          <div className="social-media">
            <i className="fa fa-facebook" aria-hidden="true"></i>
            <i className="fa fa-twitter" aria-hidden="true"></i>
            <i className="fa fa-instagram" aria-hidden="true"></i>
          </div>
        </div>
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
            <form onSubmit={handleSubmit}>
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
