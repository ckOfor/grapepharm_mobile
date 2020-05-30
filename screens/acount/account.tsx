// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform,
	NativeMethodsMixinStatic
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";

// redux
import { ApplicationState } from "../../redux";

// components

// styles
import {Layout} from "../../constants";
import {colors, fonts, images} from "../../theme";

interface DispatchProps {

}

interface StateProps {
	authSearchKey: string
}

interface MyFormValues {
	searchKey: string
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps

const ROOT: ViewStyle = {
	height: Layout.window.height,
	backgroundColor: colors.AuthBG
};

class Account extends React.Component<NavigationScreenProps & Props> {
	
	searchKeyInput: NativeMethodsMixinStatic | any;
	
	submit = (value: any) => {
	
	};
	
	public render(): React.ReactNode {
		
		const { authSearchKey, navigation } = this.props
		
		return (
			<View
				style={ROOT}
			>
				{
					Platform.OS === "ios"
						? <StatusBar barStyle="light-content" />
						: <StatusBar barStyle={"light-content"} translucent backgroundColor={colors.companyGreen} />
				}
			</View>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({

});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authSearchKey: ''
});

export const AccountScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Account);
