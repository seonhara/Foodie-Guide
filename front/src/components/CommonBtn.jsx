import styles from "@/assets/style/components/btn.module.css";
import { Link } from "react-router-dom";

const CommonBtn = (props) => {

    return (
        <>
            {props.type == 'button' && <button className={styles.btn}>{props.text}</button>}
            {props.type == 'link' && <Link to={props.linkTo} className={styles.btn}>{props.text}</Link>}
        </>
    );
}

export default CommonBtn;