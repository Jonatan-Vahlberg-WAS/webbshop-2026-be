import mongoose from "mongoose";

const EvnettypesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
    },
});

//Validate slug to only contain lowercase letters, numbers and hyphens
EvnettypesSchema.path("slug").validate(function (slug) {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug);
}, "Invalid slug format. Only lowercase letters, numbers and hyphens are allowed.");

const Eventtypes = mongoose.model("Eventtypes", EvnettypesSchema);

export default Eventtypes;