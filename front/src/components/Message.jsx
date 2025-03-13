import styles from "@/assets/style/components/message.module.css";
import CommonBtn from '@/components/CommonBtn';

const Message = (props) => {

    return (
        <div className={props.fromWho == 'bot' ? `${styles.message} ${styles.sent}` : `${styles.message} ${styles.replies}`}>    
            <img className={styles.profile_img} src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            {props.type == 'text' && <div className={styles.box_wrap}>
                <div className={styles.box}>
                    <span>{props.cont}</span>
                </div>
            </div>}
            {props.type == 'list' && <div className={styles.box_wrap}>
                {props.cont.map((item, index) => <div className={`${styles.box} ${styles.box_list}`} key={index}>
                        <div className={styles.food_thumb}><img src={item.imgPath} alt="" /></div>
                        <div className={styles.food_info}>
                            <div className={styles.food_title}>{item.title}</div>
                            <div className={styles.food_address}>{item.address}</div>
                            <div className={styles.food_link}>{item.link}</div>
                        </div>
                    </div>
                )}
                <CommonBtn type="link" text="전체 보기" linkTo="/map" />
            </div>}
        </div>
    );
}

export default Message;