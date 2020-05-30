// react
import React from "react"

// react-native
import {
	View,
	ViewStyle,
	StatusBar,
	Platform,
	ImageBackground,
	ImageStyle,
	Image,
	TextStyle,
	NativeMethodsMixinStatic, TouchableOpacity
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";

// redux
import { ApplicationState } from "../../redux";

// components
import { TextField } from "../../components/text-field";
import { Text } from "../../components/text";

// styles
import {Layout} from "../../constants";
import {colors, fonts, images} from "../../theme";
import {translate} from "../../i18n";

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
	height: Layout.window.height
};

const BACKGROUND_IMAGE: ImageStyle = {
	width: '100%',
	height: '100%',
};

const BACKGROUND_IMAGE_VIEW: ViewStyle = {
	alignItems: 'center',
	flexDirection: "row",
	height: '15%'
};

const TOP_VIEW_ONE: ViewStyle = {
	// backgroundColor: 'red',
	width: '30%',
	height: '50%',
	paddingTop: 30,
	flexDirection: "row",
	justifyContent: "space-evenly"
};

const WELCOME: TextStyle = {
	fontFamily: fonts.PoppinsSemiBold,
	fontSize: 17,
	textAlign: "left"
}

const schema = Yup.object().shape({
	searchKey: Yup.string()
		.min(3, "common.fieldTooShort")
		.required("common.fieldRequired"),
});

class Search extends React.Component<NavigationScreenProps & Props> {
	
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
				<ImageBackground
					style={BACKGROUND_IMAGE}
					source={images.searchBKC}
					resizeMethod={'auto'}
					resizeMode='stretch'
				>
					<View
						style={BACKGROUND_IMAGE_VIEW}
					>
						
						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={TOP_VIEW_ONE}
						>
							<Image
								source={images.cancelIcon}
								resizeMethod={'auto'}
								resizeMode='cover'
							/>
							
							<Text
								style={WELCOME}
							>
								{translate(`landing.search`)}
							</Text>
						</TouchableOpacity>
					</View>
					
					<Formik
						initialValues={{
							searchKey: authSearchKey
						}}
						validationSchema={schema}
						onSubmit={this.submit}
						enableReinitialize
						validateOnBlur={false}
					>
						{({
							  values,
							  handleChange,
							  handleBlur,
							  errors,
							  isValid,
							  handleSubmit,
							  handleReset
						  }: FormikProps<MyFormValues>) => (
							<View>
								
								<View
									style={{
										alignItems: 'center',
									}}
								>
									<TextField
										style={{
											borderRadius: 100,
											width: Layout.window.width / 1.1,
											backgroundColor: colors.white,
											borderColor: colors.white
										}}
										inputStyle={{
											backgroundColor: colors.white,
											width: '90%',
											borderRadius: 100
										}}
										name="searchKey"
										keyboardType="default"
										placeholderTx="landing.search"
										value={values.searchKey}
										onChangeText={handleChange("searchKey")}
										onBlur={handleBlur("searchKey")}
										autoCapitalize="none"
										returnKeyType="search"
										isInvalid={!isValid}
										fieldError={errors.searchKey}
										forwardedRef={i => {
											this.searchKeyInput = i
										}}
										onFocus={() => {
										
										}}
										onSubmitEditing={() => handleSubmit()}
										topComponent={
											<Image
												style={{
													marginLeft: 10
												}}
												source={images.searchIcon}
												resizeMethod={'auto'}
												resizeMode='cover'
											/>
										}
									/>
								
								</View>
							</View>
						)}
					</Formik>
				</ImageBackground>
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

export const SearchScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Search);
