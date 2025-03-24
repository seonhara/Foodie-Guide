import { useEffect, useState, useRef } from 'react'
import { getAiagent } from '@/api/getAiagent'
import Message from '@/components/Message'
import CommonBtn from '@/components/CommonBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import sideBtnData from '@/data/sideButton'
import useGeoLocation from '@/hooks/useGeoLocation'
import useGetRestaurants from '@/hooks/useGetRestaurants'

const Home = () => {
  const savedMessage = sessionStorage.getItem('messageList')
  // const [messageList, setMessageList] = useState(savedMessage ? JSON.parse(savedMessage) : [])
  const [messageList, setMessageList] = useState([])
  const [buttonList, setButtonList] = useState({})
  const [userInput, setUserInput] = useState('')
  const [timeState, setTimeState] = useState(0)
  const { currentLocation, currentAddress, error, requestLocation } = useGeoLocation()

  const [menus, setMenus] = useState([])
  const [otherLocation, setOtherLocation] = useState('')

  const { restaurants, nearestIndex, loading, resError = error } = useGetRestaurants(menus[0], otherLocation)
  const messageEndRef = useRef(null)
  // const chatCategory = ['먹고 싶은 음식점 메뉴 설명 및 추천', '식당 추천 요청 또는 특정 메뉴 언급']
  const chatCategory = [
    '일반 대화',
    '음식점 메뉴 추천 없이 일반 질문',
    '음식점 메뉴 추천',
    '본인 상태 알림 및 관련 음식점 메뉴 추천',
    '먹고 싶은 음식점 메뉴 설명 및 추천',
    '식당 추천 요청 또는 특정 메뉴 언급',
  ]

  const addUserMessage = (input) => {
    const newMessage = {
      fromWho: 'user',
      type: 'text',
      cont: input,
    }
    setMessageList((prev) => [...prev, newMessage])
    setUserInput('')
  }
  const addBotMessage = async (query) => {
    const result = await getAiagent(query)
    const hasCat = chatCategory.includes(result.category)

    if (!hasCat) {
      const newMessage = {
        fromWho: 'bot',
        type: 'text',
        cont: result.reply,
      }
      setMessageList((prev) => [...prev, newMessage])
    } else {
      // 식당 추천해주는 경우 -> list 불러오기
      const menus = result.menus
        .replace('답변: ', '')
        .split(', ')
        .map((item) => item.trim())
      setMenus(menus)
    }
  }

  const submitMessage = async (event, user_message) => {
    event.preventDefault()
    addUserMessage(user_message)
    await addBotMessage(user_message)
  }

  useEffect(() => {
    // 식당 list 추가
    if (!restaurants && nearestIndex == -1) return

    const newMessage = {
      fromWho: 'bot',
      type: 'list',
      cont: restaurants.map((item) => {
        return { ...item, imgPath: 'http://emilcarlsson.se/assets/mikeross.png' }
      }),
    }
    const mapData = { items: restaurants, nearestIndex: nearestIndex, currentAddress: currentAddress }
    sessionStorage.setItem('mapData', JSON.stringify(mapData))
    setMessageList((prev) => [...prev, newMessage])
  }, [nearestIndex])

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

    // sessionStorage.setItem('messageList', JSON.stringify(messageList))
    messageList.length > 0 && messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    messageList.length > 0 && setTimeState(-1)
  }, [messageList])

  return (
    <div id="frame">
      <div id="sidepanel">
        {/* {buttonList.map((item, index) => {
          return <CommonBtn type={item.type} text={item.text} linkTo={item.linkTo ? item.linkTo : ''} onClick={(event) => submitMessage(event, item.message)} key={index} />
        })} */}
      </div>
      <div className="content">
        <div className="title">
          <div>
            Foodie Guide <span>with ChatGPT</span>
          </div>
          <CommonBtn
            type="button"
            text="현재 위치 공유"
            onClick={(e) => {
              e.preventDefault()
              requestLocation()
            }}
          />
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
                  return <Message fromWho={item.fromWho} type={item.type} cont={item.cont} linkToData={item.linkToData || {}} key={index} />
                })}
              </div>
              <div ref={messageEndRef}></div>
            </>
          )}
        </div>
        <div className="message-input">
          <div className="wrap">
            <form onSubmit={(event) => submitMessage(event, userInput)}>
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
