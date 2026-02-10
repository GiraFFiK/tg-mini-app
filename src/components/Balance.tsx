export default function Balance(){
    return(
        <div className="balance">
            <div className="container">
                <div className="balance__inner">
                    <div className="balance__info">
                        <h2 className="balance__header">Ваш баланс</h2>
                        <div className="balance__amount">0.00</div>
                        <div className="balance__remain">Хватит на ~30 дней</div>
                    </div>
                    <button className="balance__button button">Пополнить</button>
                </div>
            </div>
        </div>
    )
}