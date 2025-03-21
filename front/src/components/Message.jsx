import styles from '@/assets/style/components/message.module.css'
import CommonBtn from '@/components/CommonBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Message = (props) => {
  return (
    <div className={props.fromWho == 'bot' ? `${styles.message} ${styles.sent}` : `${styles.message} ${styles.replies}`}>
      <img className={styles.profile_img} src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
      {props.type == 'text' && (
        <div className={styles.box_wrap}>
          <div className={styles.box}>
            <span>{props.cont}</span>
          </div>
        </div>
      )}
      
      {props.type == 'list' && (
        <div className={styles.box_wrap}>
          {props.cont.map((item, index) => (
            <div className={`${styles.box} ${styles.box_list}`} key={index}>
              <div className={styles.food_thumb}>
                <img src={item.imgPath} alt="" />
              </div>
              <div className={styles.food_info}>
                <div className={styles.food_title}>{item.title}</div>
                <div className={styles.contact_list}>
                  <span className={styles.list_item}></span>
                  <FontAwesomeIcon icon="fa-solid fa-location-dot" />
                  <span className={styles.list} >{item.address}</span>
                </div>
                <div className={styles.contact_list}>
                  <span className={styles.list_item}></span>
                  <FontAwesomeIcon icon="fa-solid fa-phone" />
                  <span className={styles.list} >{item.tel}</span>
                </div>
        
                <div className={styles.contact_list}>
                  <span className={styles.list_item}></span>
                  <FontAwesomeIcon icon="fa-solid fa-paperclip" />
                  <span className={styles.list} >{item.link}</span>
                </div>

              </div>
            </div>
          ))}
          <CommonBtn type="link" text="전체 보기" linkTo="/map" />
        </div>
      )}
    </div>
  )
}

export default Message
