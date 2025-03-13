import { useEffect, useState, useRef } from "react";
import { predict } from "@/api/predict";
import Message from "@/components/Message";
import CommonBtn from '@/components/CommonBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home = () => {
    const [messageList, setMessageList] = useState([]);
    const [userInput, setUserInput] = useState("");
    const messageEndRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newMessage = {
            fromWho: 'user',
            type: 'text',
            cont: userInput
        }
        setMessageList(prev => [...prev, newMessage])
        setUserInput("")
    }

    useEffect(() => {
        setMessageList([
            {
                fromWho: 'user',
                type: 'text',
                cont: "When you're backed against the wall, break the god damn thing down."
            },
            {
                fromWho: 'bot',
                type: 'text',
                cont: "Excuses don't win championships."
            },
            {
                fromWho: 'bot',
                type: 'text',
                cont: "Oh yeah, did Michael Jordan tell you that?"
            },
            {
                fromWho: 'user',
                type: 'text',
                cont: "When you're backed against the wall, break the god damn thing down."
            },
            {
                fromWho: 'user',
                type: 'text',
                cont: "Oh yeah, did Michael Jordan tell you that?"
            },
            {
                fromWho: 'bot',
                type: 'text',
                cont: "When you're backed against the wall, break the god damn thing down."
            },
            {
                fromWho: 'user',
                type: 'text',
                cont: "When you're backed against the wall, break the god damn thing down."
            },
            {
                fromWho: 'bot',
                type: 'list',
                cont: [
                    {
                        imgPath: "http://emilcarlsson.se/assets/mikeross.png",
                        title: "data.title", 
                        address: "data.address", 
                        link: "data.link", 
                    },
                    {
                        imgPath: "http://emilcarlsson.se/assets/mikeross.png",
                        title: "data.title.2222", 
                        address: "data.address.2222", 
                        link: "data.link.2222", 
                    },
                ]
            },
        ])
    }, [])
    
    useEffect(() => {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

  return (
    <div id="frame">
        <div id="sidepanel">
            <CommonBtn type="button" text="배가 아픔"/>
            <CommonBtn type="link" text="피부 난리남" linkTo="/map"/>
            {/* <div id="profile">
                <div className="wrap">
                    <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                    <p>Mike Ross</p>
                    <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                            <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                    <div id="expanded">
                        <label for="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mikeross" />
                        <label for="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="ross81" />
                        <label for="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mike.ross" />
                    </div>
                </div>
            </div>
            <div id="search">
                <label for=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status online"></span>
                            <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
                            <div className="meta">
                                <p className="name">Louis Litt</p>
                                <p className="preview">You just got LITT up, Mike.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact active">
                        <div className="wrap">
                            <span className="contact-status busy"></span>
                            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                            <div className="meta">
                                <p className="name">Harvey Specter</p>
                                <p className="preview">Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status away"></span>
                            <img src="http://emilcarlsson.se/assets/rachelzane.png" alt="" />
                            <div className="meta">
                                <p className="name">Rachel Zane</p>
                                <p className="preview">I was thinking that we could have chicken tonight, sounds good?</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status online"></span>
                            <img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="" />
                            <div className="meta">
                                <p className="name">Donna Paulsen</p>
                                <p className="preview">Mike, I know everything! I'm Donna..</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status busy"></span>
                            <img src="http://emilcarlsson.se/assets/jessicapearson.png" alt="" />
                            <div className="meta">
                                <p className="name">Jessica Pearson</p>
                                <p className="preview">Have you finished the draft on the Hinsenburg deal?</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/haroldgunderson.png" alt="" />
                            <div className="meta">
                                <p className="name">Harold Gunderson</p>
                                <p className="preview">Thanks Mike! :)</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/danielhardman.png" alt="" />
                            <div className="meta">
                                <p className="name">Daniel Hardman</p>
                                <p className="preview">We'll meet again, Mike. Tell Jessica I said 'Hi'.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status busy"></span>
                            <img src="http://emilcarlsson.se/assets/katrinabennett.png" alt="" />
                            <div className="meta">
                                <p className="name">Katrina Bennett</p>
                                <p className="preview">I've sent you the files for the Garrett trial.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/charlesforstman.png" alt="" />
                            <div className="meta">
                                <p className="name">Charles Forstman</p>
                                <p className="preview">Mike, this isn't over.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="" />
                            <div className="meta">
                                <p className="name">Jonathan Sidwell</p>
                                <p className="preview"><span>You:</span> That's bullshit. This deal is solid.</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div id="bottom-bar">
                <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
            </div> */}
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
                        return <Message fromWho={item.fromWho} type={item.type} cont={item.cont} key={index}/>
                    })}
                </div>
                <div ref={messageEndRef}></div>
            </div>
            <div className="message-input">
                <div className="wrap">
                    <form onSubmit={handleSubmit}>
                        <input
                        type="text"
                        placeholder="Write your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button className="submit">
                            <FontAwesomeIcon icon="fa-solid fa-paper-plane" className="fa fa-paperclip attachment" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Home;
