import Eventtypes from '../models/Eventtypes.js';
import EventsEventtypes from '../models/connecting/eventsEventtypes.js';

class TypesController {
  typesGet = async (req, res) => {
    try {
      const types = await Eventtypes.find();

      if (types.length === 0) {
        return res.status(200).json({ count: 0, types: [] });
      }

      res.status(200).json({ count: types.length, types });
    } catch (error) {
      console.error('Error fetching types:', error);
      res.status(500).json({ error: 'Failed to fetch types' });
    }
  };

  typesPost = async (req, res) => {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    try {
      const existingType = await Eventtypes.findOne({ slug });
      if (existingType) {
        return res.status(400).json({ error: 'Slug already exists' });
      }

      const newType = new Eventtypes({ name, slug });
      await newType.save();

      res.status(201).json(newType);
    } catch (error) {
      console.error('Error creating type:', error);
      res.status(500).json({ error: 'Failed to create type' });
    }
  };

  editTypePut = async (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Type ID is required' });
    }

    try {
      const type = await Eventtypes.findById(id);
      if (!type) {
        return res.status(404).json({ error: 'Type not found' });
      }

      const isActive = await EventsEventtypes.findOne({
        eventtypesId: id,
      });

      if (isActive && slug && slug !== type.slug) {
        return res.status(400).json({
          error: 'Cannot change slug when type is linked to active events',
        });
      }

      if (name) type.name = name;
      if (slug) type.slug = slug;

      await type.save();

      res.status(200).json(type);
    } catch (error) {
      console.error('Error updating type:', error);
      res.status(500).json({ error: 'Failed to update type' });
    }
  };

  typesDelete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Type ID is required' });
    }

    try {
      const isActive = await EventsEventtypes.findOne({
        eventtypesId: id,
      });

      if (isActive) {
        return res.status(400).json({
          error: 'Cannot delete type that is linked to events',
        });
      }

      const deletedType = await Eventtypes.findByIdAndDelete(id);
      if (!deletedType) {
        return res.status(404).json({ error: 'Type not found' });
      }

      res.status(200).json({ message: 'Type deleted successfully' });
    } catch (error) {
      console.error('Error deleting type:', error);
      res.status(500).json({ error: 'Failed to delete type' });
    }
  };
}

export default TypesController;
