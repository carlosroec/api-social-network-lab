export default class FriendService {
    constructor(logger, friendModel) {
        this.logger = logger;
        this.friendModel = friendModel;
    }

    async Add({userID, friendID}) {
        try {
            this.logger.silly('Creating a Friend record');

            const friendRecord = await this.friendModel.create({
                userID,
                friendID
            });

            const friend = friendRecord.toObject();

            return friend;
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }

    async MyFriends({myID}) {
        try {
            this.logger.silly('Listing my friends');

            const myFriendsRecord = await this.friendModel.find({ 'myID': myID });

            return myFriendsRecord;
        } catch (err) {
            this.logger.error(err);

            throw err;
        }
    }
}
