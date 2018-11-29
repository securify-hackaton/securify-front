import React from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions, Image } from 'react-native';
import Gradient from './Gradient';
import env from './config/env.config'


export default class WaitingAuthenticate extends React.Component {

	async componentDidMount() {
		const { navigation } = this.props;

		const httpUrl = navigation.getParam('httpUrl', null);
		const fieldName = navigation.getParam('fieldName', null);
		const fieldValue = navigation.getParam('fieldValue', null);
		const onSuccess = navigation.getParam('onSuccess', null);

		const userToken = this.props.screenProps.userToken;
		const data = new FormData();
		if (fieldName !== null && fieldValue !== null) data.append(fieldName, fieldValue);
		data.append('image', {
			uri: navigation.getParam('photo', null).uri,
			type: 'image/jpeg',
			name: 'photo'
		})
		try {
			const response = await fetch(env.BASE_URL + httpUrl, {
				method: 'POST',
				headers: {
					'Authorization': userToken
				},
				body: data
			});
			console.log(response);
			const responseJson = await response.json()
			if (responseJson.status >= 400) {
				console.warn(responseJson.message)
				this.props.navigation.navigate('Camera', {
					httpUrl: httpUrl,
					fieldName: fieldName,
					fieldValue: fieldValue,
					onSuccess: onSuccess
				});
			} else {
				console.log('OK')
				this.props.navigation.navigate(onSuccess);
			}
		}
		catch (error) {
			console.warn(error);
		}
	}

	render() {
		const { navigation } = this.props;

		const photo = navigation.getParam('photo', null).uri;
		const { height, width } = Dimensions.get('window');
		return (
			<View style={styles.container}>
				<Gradient />
				<Image
					style={{ 
						width: width, 
						height: height, 
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
						opacity: 0.9
					}}
					source={{ uri: photo }} />
				<ActivityIndicator size="large" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	mainText: {
		color: '#fff'
	}
});