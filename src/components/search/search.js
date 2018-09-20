import React, { Component } from "react";
import {
    Text,
    View,
    Dimensions,
    TextInput,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import PostCard from "./searchCard";
import Comment from "./comment";
import { Navigation } from "react-native-navigation";
import { lookupAccounts } from "../../providers/steem/dsteem";
import { SEARCH_API_TOKEN } from "../../../config";
import ActionSheet from 'react-native-actionsheet';

export default class Search extends Component {
    constructor() {
        super();
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            text: "",
            scroll_id: "",
            posts: [],
            users: [],
            loading: false,
        };
    }

    closeSearch = () => {
        Navigation.dismissOverlay(this.props.componentId);
    };

    handleSearch = async text => {
        let users;
        let posts;
        let scroll_id;

        await this.setState({
            loading: true,
            text: text
        });

        if (this.state.text.length > 2) {
            users = await lookupAccounts(text);
            console.log(users);
            
            await this.setState({ users: users });
    
            let data = { q: text };
            await fetch("https://api.search.esteem.app/search", {
                method: "POST",
                headers: {
                    Authorization: SEARCH_API_TOKEN,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then(result => result.json())
                .then(result => {
                    console.log(result);
                    
                    posts = result.results;
                    scroll_id = result.scroll_id;
                })
                .catch(error => {
                    console.log(error);
                });
    
            await this.setState({ loading: false });
    
            await this.setState({
                posts: posts,
                scroll_id: scroll_id,
            });
        }
    };

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    renderHeader = () => {
        return (
            this.state.posts.length > 0 ? (
                <View style={{ flexDirection: 'row', backgroundColor: '#f6f6f6', paddingTop: 10, paddingHorizontal: 10 }}>
                    <Text 
                        onPress={this.showActionSheet}
                        style={{ color: '#788187', fontSize: 12, fontWeight: '500' }}>
                        TOP POSTS
                    </Text>
                    <Ionicons 
                        size={15}
                        color='#788187'
                        name='md-arrow-dropdown'
                        style={{ marginLeft: 5 }}
                    />
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={'Which one do you like ?'}
                        options={['Best', 'Relevance', 'Date', 'Close']}
                        cancelButtonIndex={3}
                        destructiveButtonIndex={3}
                        onPress={(index) => { /* Save state and fetch new results */ }}
                    />
                </View>
            ) : (
                <View></View>
            )
        )
    }
    
    render() {
        return (
            <View
                style={{
                    backgroundColor: "white",
                    height: Dimensions.get("window").height,
                    paddingTop: 25,
                    flex: 1
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        borderRadius: 8,
                        backgroundColor: "#f5f5f5",
                        paddingLeft: 10,
                        marginHorizontal: 10,
                    }}
                >
                    <Ionicons
                        name="md-search"
                        style={{
                            flex: 0.1,
                            fontSize: 18,
                            top: 10,
                            color: "#788187",
                        }}
                    />

                    <TextInput
                        style={{ flex: 0.9, height: 40 }}
                        autoCapitalize="none"
                        onChangeText={text => this.handleSearch(text)}
                        value={this.state.text}
                    />

                    <Ionicons
                        onPress={this.closeSearch}
                        name="md-close-circle"
                        style={{
                            flex: 0.1,
                            fontSize: 15,
                            top: 12.5,
                            color: "#c1c5c7",
                        }}
                    />
                </View>

                { /** USERS */  }
                <View style={{ paddingTop: 10, marginTop: 10 }}>
                    
                    <View style={{ backgroundColor: 'white', borderRadius: 5, margin: 5 }}>
                        { this.state.users.length > 0 ? (
                            <Text style={{ color: '#788187', left: 10, fontSize: 15 }}>Users</Text>
                        ) : (<View></View>) }
                        <FlatList
                            data={this.state.users}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <View
                                    style={{ margin: 10, flexDirection: "row" }}>
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: "gray",
                                        }}
                                        source={{
                                            uri: `https://steemitimages.com/u/${item}/avatar/small`,
                                        }}
                                    />
                                    <View style={{ alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                fontWeight: "500",
                                                fontSize: 13,
                                                left: 8,
                                                top: 12
                                            }}>
                                            @{item}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(post, index) => index.toString()}
                            removeClippedSubviews={true}
                            onEndThreshold={0}
                        />
                    </View>
                </View>

                { /** POSTS */  }
                <View style={{ flex: 1, backgroundColor: '#f6f6f6', margin: 0, borderRadius: 5 }}>
                    <FlatList
                        data={this.state.posts}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={this.renderHeader}
                        renderItem={({ item }) => {
                            if (item.permlink.startsWith('re-')) {
                                return (
                                    <Comment comment={item} />
                                )
                            } else {
                                return (
                                    <PostCard content={item}/>
                                )
                            }
                        }}
                        keyExtractor={(post, index) => index.toString()}
                        removeClippedSubviews={true}
                        onEndThreshold={0}
                        initialNumToRender={20}
                    />
                </View>
            </View>
        );
    }
}
