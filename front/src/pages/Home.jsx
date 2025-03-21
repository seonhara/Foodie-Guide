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
            title: '추천 식당',
            address: 'address',
            tel : 'data.tel',
            link: 'data.link',
            
          },
          {
            imgPath: 'http://emilcarlsson.se/assets/mikeross.png',
            title: '추천 식당',
            address: 'address',
            tel : 'data.tel',
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
	      type: 'button',
        text: '뼈골절',
        message: '내가 뼈 부러졌는데 회복에 좋은 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '심장병',
        message: '심장이 않좋아 심장에 좋은 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '뇌',
        message: '머리가 잘안돌아가 뇌에 좋은 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '비건',
        message: '중식이 먹고 싶은데 중식 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '한식',
        message: '한식이 먹고 싶은데 한식 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '중식',
        message: '중식이 먹고 싶은데 중식 메뉴 추천해줘',
      },
     {
        type: 'button',
        text: '일식',
        message: '일식이 먹고 싶은데 일식 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '분식',
        message: '분식이 먹고 싶은데 분식 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '양식',
        message: '양식이 먹고 싶은데 양식 메뉴 추천해줘',
      },
      {
        type: 'button',
        text: '이슬람교',
        message: '나 이슬람 신자야. 돼지고기랑 술을 안 먹고, 할랄 음식을 먹어야해. 식당 추천해줘.',
      },
      {
        type: 'button',
        text: '힌두교',
        message: '나 힌두교 신자야. 채식 중심으로 음식을 먹고, 유제품이 좋아. 적당한 식당 추천해줘.',
      },
      {
        type: 'button',
        text: '유대교',
        message: '나 유대교 신자야. 코셔 규정을 따라 만들어진 음식을 먹고싶어. 적당한 식당 추천해줘.',
      },
      {
        type: 'button',
        text: '불교',
        message: '나 불교 신자야. 채식 위주의 간소한 식사를 원해. 적당한 식당 추천해줘.',
      },
      {
        type: 'button',
        text: '저탄수화물',
        message: '나 요즘 다이어트 중이야. 탄수화물 없는 메뉴 추천해줘.',
      },
      {
        type: 'button',
        text: '고단백',
        message: '나 요즘 다이어트 중이야. 고단백 식단 추천해줘.',
      },
      {
        type: 'button',
        text: '샐러드',
        message: '나 요즘 다이어트 중이야. 샐러드 파는 곳 없을까?',
      },
      {
        type: 'button',
        text: '그리스',
        message: '나 한국에 사는 그리스 사람인데 그리스 음식이 그리워. 그리스 식당 추천해줘',
      },
      {
        type: 'button',
        text: '프랑스',
        message: '나 한국에 사는 프랑스 사람인데 프랑스 음식이 그리워. 프랑스 식당 추천해줘',
      },
      {
        type: 'button',
        text: '인도',
        message: '나 한국에 사는 인도 사람인데 인도 음식이 그리워. 인도 식당 추천해줘',
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
