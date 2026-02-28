from datetime import datetime
from app.extensions.db import mongo
from bson import ObjectId

def create_resume(data):
    data["uploadedAt"] = datetime.utcnow()
    return mongo.db.resumes.insert_one(data)


def get_resumes_by_user(user_id):
    resumes = list(
        mongo.db.resumes.find(
            {"userId": user_id},
            {"rawText": 0}
        )
    )

    for r in resumes:
        r["_id"] = str(r["_id"])
        r["userId"] = str(r["userId"])

        if "uploadedAt" in r and r["uploadedAt"]:
            r["uploadedAt"] = r["uploadedAt"].isoformat()

    return resumes

def update_resume_analysis(resume_id, analysis):
    mongo.db.resumes.update_one(
        {"_id": ObjectId(resume_id)},
        {"$set": {"analysis": analysis}}
    )

def update_resume_analysis(resume_id, analysis):
    mongo.db.resumes.update_one(
        {"_id": ObjectId(resume_id)},
        {
            "$set": {
                "analysis": analysis,
                "analyzedAt": datetime.utcnow()
            }
        }
    )

