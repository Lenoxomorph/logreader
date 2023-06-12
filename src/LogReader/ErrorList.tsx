import './Styles/ErrorList.css';
import ErrorLog from "./Structures/ErrorLog";

type Props = {
    errorList: ErrorLog[];
};

export default function ErrorList({errorList}: Props) {

    return <ul>
        {errorList.map(error => (
            <li onClick={() => console.log(errorList)}>
                {error.date.concat(error.tag)}
            </li>))}
    </ul>;
    // error.ref.current.scrollIntoView()
    //display the errors, the errors need a jump poinmt. Erros should have a date, and what they are, and a reference
}