import React from 'react'
import './UserFriendsComponent.scss'
const UserFriendsComponent = () => {
  return (
  
         <div  className="infoUser_item col-md-3 col-sm-6 py-2 ">
            <div className="  d-flex ">
                <img className="avatar-homeAll" src="https://khoinguonsangtao.vn/wp-content/uploads/2022/08/hinh-anh-avatar-sadboiz.jpg"/>
               <div style={{width:'100%'}}  className="d-flex justify-content-between">
                    <div className="infoUser d-flex flex-column ">
                        <h1>Mai Văn A</h1>
                        <p style={{color:'rgb(148, 148, 148)'}}>Đi chơi không</p>
                    </div>
                    <div style={{marginRight:60}}>
                        <p style={{color:'rgb(148, 148, 148)'}}>11 phút</p>
                        <p style={{color:'#f45484', fontWeight:600}}>Online</p>
                    </div>
               </div>
            </div>
        </div>
   
  )
}

export default UserFriendsComponent