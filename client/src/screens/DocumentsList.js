import React, {Component} from "react";
import {connect} from "react-redux";
import {clearDocuments, clearDocument, getDocuments} from "../actions/documentActions";
import {countEsentials} from "../actions/otherActions";
import Document from "../components/Document";
import {firebase} from "../Firebase";

class DocumentsList extends Component {
    state = {
        documents: [],
        documentsCount: 0,
        offset: 0,
        limit: 5,
        loaded: false,
        dummy: false
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearDocuments());
        this.props.dispatch(getDocuments(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.others.counts) {
            if(nextProps.documents.documentsList) {
                let documents = nextProps.documents.documentsList.documentsData;
                this.setState({
                    documents: documents,
                    offset: nextProps.documents.documentsList.offset,
                    limit: nextProps.documents.documentsList.limit,
                    documentsCount: nextProps.others.counts.documentsCount,
                    loaded: true
                });
            }
        }

        if(nextProps.documents.deletedDocument != null) {
            window.location.reload();
            this.props.dispatch(clearDocument());
        }
    }

    renderDocuments = (documentsList) => {
        return documentsList.map(document => {
            return (
                <Document key={document.documentId} document={document} userRole={this.props.users.login.user.userRole}/>
            );
        });
    }


    renderNavButtons = () => {
        return (
            <div className="list_nav_buttons">
                <div className="prev" onClick={() => this.loadPrev(this.state.offset, this.state.limit)}>
                    Prev
                </div>
                <div className="next" onClick={() => this.loadNext(this.state.offset, this.state.limit)}>
                    Next
                </div>
            </div>
        )
    }

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.documentsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getDocuments(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getDocuments(offset - limit, limit));
        }
    }

    render() {

        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Documents list</h1>

                    <div>

                        {this.state.documents.length > 0 ? this.renderDocuments(this.state.documents) : <div className="message">No documents received yet.</div>}

                    </div>

                    {this.state.documents.length > 0 ? this.renderNavButtons() : null}

                </div>
            );
        } else {
            return (
                <div className="loader"/>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        documents: state.documents,
        others: state.others
    }
}

export default connect(mapStateToProps)(DocumentsList);