import React from "react";
import ReactDOM from "react-dom";
import React, {useState, useEffect} from 'react';


import PropTypes from 'prop-types';


import bridge from "@vkontakte/vk-bridge";
import {Panel, PanelHeader, Header, Button, Group, 
        Cell, Div, Avatar, PanelHeaderBack, View, 
        ScreenSpinner, AdaptivityProvider, AppRoot, 
        ConfigProvider, SplitLayout, SplitCol} from '@vkontakte/vkui';


import './Persik.css';
import persik from '../img/persik.png';
import '@vkontakte/vkui/dist/vkui.css';


bridge.send("VKWebAppInit"); //Init VK  Mini App



function Home({id, go, fetchedUser}){
  <Panel id={id}>
    <PanelHeader>Example</PanelHeader>
    {fetchedUser &&
    <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
      <Cell
        before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
        description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
      >
        {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
      </Cell>
    </Group>}

    <Group header={<Header mode="secondary">Navigation Example</Header>}>
      <Div>
        <Button stretched size="l" mode="secondary" onClick={go} data-to="persik">
          Show me the Persik, please
        </Button>
      </Div>
    </Group>
  </Panel>
};
Home.propTypes={
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};


function Persik (props){
  <Panel id={props.id}>
    <PanelHeader
      left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
    >
      Persik
    </PanelHeader>
    <img className="Persik" src={persik} alt="Persik The Cat"/>
  </Panel>
};
Persik.propTypes={
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
};


function App(){
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);

	useEffect(() => {
    bridge.subscribe(({ detail: { type, data }}) => {
      if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
			}
		});
    
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);
  
	function go(e){
		setActivePanel(e.currentTarget.dataset.to);
	};

	return(
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go}/>
								<Persik id='persik' go={go}/>
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}


ReactDOM.render(<App/>, document.getElementById("root"));
if (process.env.NODE_ENV === "development"){
  import("./eruda").then(({default: eruda}) => {}); //runtime download
}