// react
import React from "react"

// react-native
import {
	View, ViewStyle, StatusBar, Platform, ImageBackground, ImageStyle, Image, TextStyle, NativeMethodsMixinStatic,
	FlatList, TouchableOpacity, ScrollView, Linking
} from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";

// redux
import { ApplicationState } from "../../redux";

// components
import { TextField } from "../../components/text-field";
import { Text } from "../../components/text";

// styles
import {Layout} from "../../constants";
import {colors, fonts, images} from "../../theme";
import {translate} from "../../i18n";
import {setAuthUserType} from "../../redux/auth";

interface DispatchProps {
	setAuthUserType: (userType: string) => void
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
	// height: Layout.window.height
};

const BACKGROUND_IMAGE: ImageStyle = {
	width: '100%',
	height: '100%',
};

const BACKGROUND_IMAGE_VIEW: ViewStyle = {
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: "row",
	height: '30%',
	// backgroundColor: 'blue',
};

const TOP_VIEW_ONE: ViewStyle = {
	// backgroundColor: 'red',
	width: '50%',
	height: '50%',
	paddingLeft: 20,
};

const TOP_VIEW_TWO: ViewStyle = {
	width: '50%',
	height: '50%',
	alignItems: "center",
	justifyContent: "center",
	// backgroundColor: 'blue',
};

const WELCOME: TextStyle = {
	fontFamily: fonts.PoppinsMedium,
	fontSize: 14
}

const APP_NAME: TextStyle = {
	fontFamily: fonts.PoppinsSemiBold,
	fontSize: 24,
	lineHeight: 30
}

const DESCRIPTION: TextStyle = {
	fontFamily: fonts.PoppinsMedium,
	fontSize: 10
}

const schema = Yup.object().shape({
	searchKey: Yup.string()
		.min(3, "common.fieldTooShort")
		.required("common.fieldRequired"),
});

class Landing extends React.Component<NavigationScreenProps & Props> {
	
	searchKeyInput: NativeMethodsMixinStatic | any;
	
	submit = (value: any) => {

	};

	public render(): React.ReactNode {

		const { authSearchKey, navigation, setAuthUserType } = this.props

		const data = [
			require('../../assets/callUs.png'),
			require('../../assets/doctor.png'),
			require('../../assets/pharmacies.png'),
		]

		const pharmacies = [
			{
				name: 'Avalon Chemists',
				description: 'No 9 Awolowo Road, off Adeola Ajose st',
				src: require('../../assets/pharm1.png'),
				rating: '4.7'
			},
			{
				name: 'Alpina Pharmacy',
				description: 'No 9 Awolowo Road, off Adeola Ajose st',
				src: require('../../assets/pharm2.png'),
				rating: '3.9'
			},
			{
				name: 'Drug Loft',
				description: 'No 9 Awolowo Road, off Adeola Ajose st',
				src: require('../../assets/pharm1.png'),
				rating: '3.6'
			},
		]

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
					source={images.landingBKG}
					resizeMethod={'auto'}
					resizeMode='stretch'
				>
					<View
						style={BACKGROUND_IMAGE_VIEW}
					>
						
						<View
							style={TOP_VIEW_ONE}>
							<Text
								style={WELCOME}
							>
								{translate(`landing.welcome`)}
							</Text>
							
							<Text
								style={APP_NAME}
							>
								{translate(`landing.appName`)}
							</Text>
							
							<Text
								style={DESCRIPTION}
							>
								{translate(`landing.description`)}
							</Text>
						</View>
						
						<View
							style={TOP_VIEW_TWO}>
							
							<Image
								source={images.doctorStanding}
								resizeMethod={'auto'}
								resizeMode='stretch'
							/>
						</View>
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
											this.searchKeyInput.blur();
											navigation.navigate('search')
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
					
					<ScrollView
						showsVerticalScrollIndicator={false}
						bounces={false}
						alwaysBounceHorizontal={false}
						alwaysBounceVertical={false}
						contentContainerStyle={{
							paddingBottom: 10
						}}
					>
						<View>
							<FlatList
								contentContainerStyle={{
									// alignItems: 'center',
									paddingStart: 5,
									paddingEnd: 5,
								}}
								data={data}
								showsHorizontalScrollIndicator={false}
								horizontal
								// @ts-ignore
								renderItem={(story: any) => {
									const { item, index } = story;
									
									return (
										<TouchableOpacity
											// onPress={() => navigation.navigate('signIn')}
											onPress={() => {
												if (index === 0) {
													const text = "Hello GrapePharm..."
													const phoneNumber = "23409010828496"
													Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`)
												} else if (index === 1) {
													setAuthUserType('Doctor')
													navigation.navigate('docSignUp')
												} else if (index === 2) {
													setAuthUserType('Company')
													navigation.navigate('comSignUp')
												}
											}}
										>
											<Image
												source={item}
											/>
										</TouchableOpacity>
									)
								}}
							/>
						</View>
						
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: '100%'
							}}
						>
							<Text
								style={{
									marginLeft: 20,
									marginBottom: 20,
									color: colors.pharmacyNearYou,
									fontFamily: fonts.PoppinsSemiBold
								}}
							>
								{translate('landing.pharmacy')}
							</Text>
							
							<TouchableOpacity>
								<Text
									style={{
										marginRight: 18,
										color: colors.companyGreenTwo,
										fontFamily: fonts.PoppinsSemiBold
									}}
								>
									{translate('landing.seeAll')}
								</Text>
							</TouchableOpacity>
						</View>
						
						<View>
							<FlatList
								contentContainerStyle={{
									// alignItems: 'center',
									paddingStart: 5,
									paddingEnd: 5,
								}}
								data={pharmacies}
								showsHorizontalScrollIndicator={false}
								horizontal
								// @ts-ignore
								renderItem={(story: any) => {
									const { item, index } = story;
									
									return (
										<TouchableOpacity
										>
											<View
												style={{
													width: Layout.window.width / 3,
													height: Layout.window.height > 700 ? Layout.window.height / 5.5 : Layout.window.height / 4,
													backgroundColor: 'white',
													marginTop: 20,
													marginLeft: 10,
													marginRight: 10,
													marginBottom: 5,
													alignItems: 'center',
													borderRadius: 8,
													// shadowColor: colors.black,
													// shadowOffset: { width: 0, height: 10 },
													shadowOpacity: 0.1,
													elevation: 2
												}}
											>
												<Image
													style={{
														borderRadius: 10,
														top: -20
													}}
													source={item.src}
												/>
												
												<Text
													style={{
														color: colors.pharmName,
														fontSize: 10,
														fontFamily: fonts.PoppinsSemiBold
													}}
												>
													{item.name}
												</Text>
												
												<Text
													style={{
														color: colors.darkPurple,
														fontSize: 9,
														fontFamily: fonts.PoppinsRegular
													}}
												>
													{item.description}
												</Text>
												
												<View
													style={{
														flexDirection: "row",
														alignSelf: "flex-start",
														marginLeft: 10,
														marginTop: 10
													}}
												>
													<Image
														source={images.star}
													/>
													
													<Text
														style={{
															color: colors.darkPurple,
															fontSize: 10,
															fontFamily: fonts.PoppinsRegular,
															marginLeft: 5,
														}}
													>
														{item.rating.toString()}
													</Text>
												</View>
												
											</View>
										</TouchableOpacity>
									)
								}}
							/>
						</View>
					</ScrollView>
					
				</ImageBackground>
			</View>
		)
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
	setAuthUserType: (userType: string) => dispatch(setAuthUserType(userType))
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
	authSearchKey: ''
});

export const LandingScreen = connect<StateProps>(
	// @ts-ignore
	mapStateToProps,
	mapDispatchToProps
)(Landing);
