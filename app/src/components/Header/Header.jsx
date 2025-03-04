import React, { useRef } from 'react';
import {
  Dropdown,
  Popover,
  Whisper,
  Stack,
  Avatar,
} from 'rsuite';
import { Service } from '../../service';

import ViewPassword from './view.password';
import { ViewUser } from '../../views/setting/view.user';
import { Loading } from '../../App';
import { Exception } from '../../utils/exception';

class RenderAdminSpeaker extends React.Component {

  handleSelect = eventKey => {
    this.props.onClose()
  };

  render = () => {

    return (
      <>
        <Popover ref={this.props.ref} className={this.props.className} style={{ width: '200px', left: this.props.left, top: this.props.top }}>
          <Dropdown.Menu onSelect={this.handleSelect}>
            <Dropdown.Item onClick={this.props.onProfile}>Perfil</Dropdown.Item>
            <Dropdown.Item onClick={this.props.onPasswordChange}>Alterar senha</Dropdown.Item>
            <Dropdown.Item divider />
            <Dropdown.Item onClick={this.props.onLoggout}>Sair</Dropdown.Item>
          </Dropdown.Menu>
        </Popover>
      </>
    )
  }

}

const Header = () => {

  const viewProfile = React.createRef()
  const viewPassword = React.createRef()

  const Authorization = JSON.parse(localStorage?.getItem("Authorization"))

  const trigger = useRef(null);

  const onLoggout = async (props) => {
    try{

      Loading.Show('Saindo...');

      const r = await new Service().Post('login/sign-out').finally(() => Loading.Hide());

      if (r?.status == 200) {
        localStorage.removeItem("Authorization")
      }

    } catch (error) {
      Exception.error(error)
    }
    finally {
      Loading.Hide();
    }
  }

  const onProfile = (props) => {
    props.onClose()
    viewProfile.current.editUser(Authorization.user.id)
  }

  const onPasswordChange = (props) => {
    props.onClose()
    viewPassword.current.change(Authorization.user.id)
  }

  return (
    <>

      <ViewUser ref={viewProfile} title='Perfil' />
      <ViewPassword ref={viewPassword} />

      <Stack className="header" spacing={8}>

        <Stack direction="column" alignItems="left">
          <span style={{ fontWeight: 'bold', color: '#777' }}>
            {Authorization?.user?.userName} / {Authorization?.companyBusiness?.description} - {Authorization?.company?.surname}
          </span>
        </Stack>

        <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={(props, ref) => 
          <RenderAdminSpeaker ref={ref} {...props}
            onProfile={() => onProfile(props)}
            onPasswordChange={() => onPasswordChange(props)}
            onLoggout={() => onLoggout(props)}
          />}>
          <Avatar size="sm" circle src="https://www.citypng.com/public/uploads/preview/png-round-blue-contact-user-profile-icon-701751694975293fcgzulxp2k.png" alt="@simonguo" style={{ marginLeft: 8 }} />
        </Whisper>
      </Stack>
    </>
  )

}

export default Header;
